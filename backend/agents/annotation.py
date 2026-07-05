import logging 
import random 
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models import PositionedGraph, ExcalidrawPayload, AnnotationOutput, RectangleElement, TextElement, ArrowElement
import json
# from utils.text_wrap import wrap_text

logger = logging.getLogger(__name__)

llm = ChatGroq(
    model = "openai/gpt-oss-120b",
    temperature = 0.3,
    max_tokens = 2048
)

SYSTEM_PROMPT = """ 
You are an expert software architect reviewing a system design.
Given a positioned componenet graph, your task is to:
1. Identify 2 to 3 key architectural highlights, bottlenecks, or important decisions. 
2. For each note, you MUST use the EXACT 'id' string provided in the nodes list below. Do NOT invent new IDs or abbreviate them.
3. Write a comprehensive Architecture Decision Record (ADR) in Markdown format.

CRITICAL RULE: ONLY return the exact string ID (e.g., 'nodejs-api-gateway'). NEVER return X/Y coordinates (like 100.0 or 434.46) as IDs.

Output ONLY valid JSON matching the provided schema.
"""
PROMPT_TEMPLATE = """ 
Please analyze the architecture and provide your notes and ADR: {logical_graph_json}
"""

def generate_annotations(graph: PositionedGraph, current_payload: ExcalidrawPayload) -> ExcalidrawPayload:
    
    logger.info("Starting Annotation Agent....")
    
    #Generate logical graph for the LLM, hiding the X/Y co-ordinates preventing hallucinations
    logical_graph = {
        "nodes":[{"id":n.id, "name": n.name, "type":n.type, "layer":n.layer} for n in graph.nodes],
        "edges":[{"source": e.source, "target": e.target, "label": e.label} for e in graph.edges]
    }
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", PROMPT_TEMPLATE)
    ])
    
    chain = prompt | llm.with_structured_output(AnnotationOutput)
    
    try:
        
        result = chain.invoke({"logical_graph_json":json.dumps(logical_graph, indent = 2)})
        logger.info(f"Annotation Agent Generated {len(result.annotations)} notes and an ADR.")
        
        #------Deterministic Mapping: Convert Annotations to Excalidraw Elements----
        new_elements = list(current_payload.elements) 
        node_map = {n.id : n for n in graph.nodes}
        
        #Track occupied positions to prevent overlap of generated sticky notes
        occupied_positions = {}
        
        for idx, note in enumerate(result.annotations):
            
            #Convert the 'note' to dict for safely_accessing the fields 
            note_dict = note.model_dump() if hasattr(note, 'model_dump') else dict(note)
            
            #THE LLM can response using multiple field_names for target_note_id so check for it
            target_id = note_dict.get('target_node_id') or note_dict.get('node_id') or note_dict.get('target_id') or note_dict.get('target_node')
            note_text = note_dict.get('note_text') or note_dict.get('text') or note_dict.get('note')
            
            #Type-check if the LLM hallucinated a float
            if not isinstance(target_id, str):
                logger.warning(f"LLM hallucinated a non-string ID: {target_id} (type: {type(target_id)})")
            
            if not target_id or not note_text:
                logger.warning(f"Skipping annotation due to missing fields: {note_dict}")
                continue 
            
            target_node = node_map.get(target_id)
            if not target_node:
                logger.warning(f"Annotation target '{target_id}' not found in graph.")
                continue
            
            #Position sticky note above the target node
            note_x = target_node.x
            base_note_y = target_node.y - 120
            note_width = 160
            note_height = 60
            vertical_spacing = 80
            
            #Check if current x-position is already occupied
            if note_x not in occupied_positions:
                occupied_positions[note_x] = []
                
            note_y = base_note_y
            #Find a y-position that doesn't overlap with existing notes at x-posi
            collision_detected = True
            while collision_detected:
                collision_detected = False
                for occupied_y in occupied_positions[note_x]:
                    if abs(note_y - occupied_y) < (note_height + 20):
                        note_y = occupied_y - (note_height + vertical_spacing)
                        collision_detected = True
                        break
                    
            occupied_positions[note_x].append(note_y)
            
            
            note_id = f"note-{target_id}-{idx}"
            text_id = f"text-{note_id}"
            arrow_id = f"arrow-{note_id}"
            
            #Sticky Note Rectangle 
            new_elements.append(RectangleElement(
                id = note_id, x = note_x, y = note_y, width = note_width, height = note_height,
                strokeColor="#ca8a04", backgroundColor = "#fef9c3",
                roughness = 1, strokeStyle = "dashed",
                boundElements = [{"id": text_id, "type": "text"}, {"id": arrow_id, "type": "arrow"}],
                seed = random.randint(100000000, 999999999), versionNonce = random.randint(100000000, 999999999)
            ))
            
            #Text Inside Sticky Node
            new_elements.append(TextElement(
                id = text_id, x = note_x + 10, y = note_y + 15, width = note_width - 20, height = 30,
                text = note.note_text, originalText = note.note_text, containerId = note_id,
                strokeColor = "#713f12", fontSize = 12,
                seed = random.randint(100000000, 999999999), versionNonce=random.randint(100000000, 999999999)
            ))
            
            #Dashed Arrow pointing to the target node
            target_cx = target_node.x + 90
            target_cy = target_node.y
            note_cx = note_x + (note_width / 2)
            note_cy = note_y + note_height
            
            new_elements.append(ArrowElement(
                id=arrow_id, x=note_cx, y=note_cy,
                width=abs(target_cx - note_cx), height=abs(target_cy - note_cy),
                strokeColor="#ca8a04", backgroundColor="transparent", strokeStyle="dashed", roughness=1,
                points=[[0, 0], [target_cx - note_cx, target_cy - note_cy]],
                startBinding={"elementId": note_id, "focus": 0, "gap": 1},
                endBinding={"elementId": f"rect-{note.target_node_id}", "focus": 0, "gap": 1},
                seed=random.randint(100000000, 999999999), versionNonce=random.randint(100000000, 999999999)
            ))
            
        #Update the Payload
        current_payload.elements = new_elements
        current_payload.adr_markdown = result.adr_markdown 
        return current_payload
    
    except Exception as e:
        logger.error(f"Annotation Agent Failed: {e}")
        return current_payload #return original payload if it fails 
        