import logging 
from typing import List
import time
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models import ParsedIntent, ComponentGraph

logger = logging.getLogger(__name__)

llm = ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature = 0.2,
    max_tokens = 2048
)

REPAIR_PROMPT = """You are an expert system architect fixing a flawed architecture diagram.

ORIGINAL USER INTENT:
{user_intent}

CURRENT FLAWED GRAPH (JSON):
{current_graph_json}

ERRORS DETECTED BY VALIDATOR:
{errors}

TASK:
Analyze the errors and fix the ComponentGraph.
- If there are overlapping nodes, you may need to change the 'layer' of a node or split a layer to fix the layout later.
- If there are missing bindings, ensure 'source' and 'target' IDs in edges match the Node IDs exactly.
- Do NOT change the core architecture unless the errors force you to. Keep it as close to the current graph as possible.
- Return ONLY the corrected ComponentGraph JSON matching the schema.
"""

def repair_graph(parsed_intent: ParsedIntent, current_graph: ComponentGraph, errors: List[str]) -> ComponentGraph:
    logger.info("Starting Repair Agent....")
    start_time = time.time()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", REPAIR_PROMPT),
        ("human" , "Please fix the graph.")
    ])
    
    chain = prompt | llm.with_structured_output(ComponentGraph)
    
    try: 
        fixed_graph = chain.invoke({
            "user_intent": parsed_intent.model_dump_json(),
            "current_graph_json": current_graph.model_dump_json(),
            "errors": "\n".join(errors)
        })
        endTime = time.time() - start_time
        logger.info(f"Repair Agent successfully fixed the graph in {endTime}s")
        return fixed_graph 
    
    except Exception as e:
        logger.error(f"Repair Agent failed: {e}")
        raise e 
    
    
    
    