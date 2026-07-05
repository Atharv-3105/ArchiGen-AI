import logging 
import random 
from models import PositionedGraph, ExcalidrawPayload, RectangleElement, TextElement, ArrowElement

logger = logging.getLogger(__name__)

#Pre-define color mapping for architectural layers
LAYER_COLORS = {
    "frontend": {"bg": "#dbeafe", "stroke": "#3b82f6", "text": "#1e3a8a"},
    "api":      {"bg": "#fef9c3", "stroke": "#ca8a04", "text": "#713f12"},
    "service":  {"bg": "#dcfce7", "stroke": "#16a34a", "text": "#14532d"},
    "data":     {"bg": "#fce7f3", "stroke": "#db2777", "text": "#831843"},
    "infra":    {"bg": "#f3f4f6", "stroke": "#6b7280", "text": "#374151"},
}

#Default dimensions for nodes
NODE_WIDTH = 180
NODE_HEIGHT = 80

def generate_unique_id():
    return random.randint(100000000, 999999999)


def apply_styles(graph: PositionedGraph) -> ExcalidrawPayload:
    """  
        Takes a PositionedGraph input and Generates a ExcalidrawPayload
    """
    
    logger.info("Starting Style Agent....")
    
    elements = []
    
    #Generate rectangles and texts for Nodes
    for node in graph.nodes:
        colors = LAYER_COLORS.get(node.layer, LAYER_COLORS["infra"])
        
        #Rectangle Element
        rect_id = f"rect-{node.id}"
        rect = RectangleElement(
            id = rect_id,
            x = node.x,
            y = node.y,
            width = NODE_WIDTH,
            height = NODE_HEIGHT,
            strokeColor= colors["stroke"],
            backgroundColor = colors["bg"],
            seed = generate_unique_id(),
            versionNonce = generate_unique_id(),
            boundElements = [{"id": f"text-{node.id}", "type": "text"}]
        )
        elements.append(rect)
        
        #Add Text Element which is centered inside the rectangle
        text_id = f"text-{node.id}"
        text = TextElement(
            id = text_id,
            x = node.x + 10,
            y = node.y + (NODE_HEIGHT / 2) - 10,
            width = NODE_WIDTH - 20,
            height = 20,
            stokeColor = colors["text"],
            backgroundColor = "transparent",
            text = node.name,
            originalText = node.name,
            containerId = rect_id,
            seed = generate_unique_id(),
            versionNonce = generate_unique_id()
        )
        elements.append(text)
        
    # 2. Generate Arrows for the Edges
    for edge in graph.edges:
        #Find the source and target node inorder to calculate arrow coordinates
        source_node = next((n for n in graph.nodes if n.id == edge.source), None)
        target_node = next((n for n in graph.nodes if n.id == edge.target), None)
        
        #Add log if source or target is missing and Skip the node
        if not source_node or not target_node: 
            logger.warning(f"Edge references missing node: {edge.source} -> {edge.target}")
            continue
        
        #Calculate borders docking points instead of center points
        arrow_start_x = source_node.x + NODE_WIDTH
        arrow_start_y = source_node.y + (NODE_HEIGHT / 2)
        
        arrow_end_x = target_node.x
        arrow_end_y = target_node.y + (NODE_HEIGHT / 2)
        
        #Excalidraw arrow widths and heights must be positive
        width = abs(arrow_end_x - arrow_start_x)
        height = abs(arrow_end_y - arrow_start_y)
    
        #Arrow starts at the right edge of the source, ends at the left edge of the target
        arrow_id = f"arrow-{edge.source}-{edge.target}"
        arrow = ArrowElement(
            id = arrow_id,
            x = arrow_start_x,
            y = arrow_start_y,
            width = width,
            height = height,
            strokeColor = "#52525b",
            backgroundColor = "transparent",
            points = [[0,0], [arrow_end_x - arrow_start_x, arrow_end_y - arrow_start_y]],
            startBinding = {"elementId": f"rect-{edge.source}", "focus": 0, "gap": 1},
            endBinding = {"elementId": f"rect-{edge.target}", "focus":0, "gap": 1},
            seed = generate_unique_id(),
            versionNonce = generate_unique_id()
        )
        elements.append(arrow)
        
    logger.info(f"Style Agent completed. Generated {len(elements)} Excalidraw elements.")
    
    return ExcalidrawPayload(elements = elements)