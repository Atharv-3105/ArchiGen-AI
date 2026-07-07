import logging 
from models import ComponentGraph

logger = logging.getLogger(__name__)

def generate_mermaid(graph: ComponentGraph) -> str:
    
    """  
        Function which Converts ComponentGraph into Mermaid.js syntax
    """
    logger.info("Generating Mermaid Code....")
    
    lines = ["graph TD"]
    
    #Define Nodes
    #Since Mermaid IDs can't contain hyphens, replace them with '_'
    for node in graph.nodes:
        mer_id = node.id.replace("-", "_")
        
        #Format will be ID["Label"]
        lines.append(f' {mer_id}["{node.name}"]')
        
    #Define EDGES
    for edge in graph.edges:
        src = edge.source.replace("-", "_")
        tgt = edge.target.replace("-", "_")
        label = edge.label or ""
        
        #Format: Src -- "Label" --> Tgt
        lines.append(f' {src} -- "{label}" --> {tgt}')
        
    
    mermaid_code = "\n".join(lines)
    logger.info(f"Generated {len(lines)} lines of Mermaid code.")
    
    return mermaid_code 