import time 
import logging 
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from models import ParsedIntent, ComponentGraph

logger = logging.getLogger(__name__)

load_dotenv()

llm = ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature = 0.2,
    max_tokens = 2048
)

SYSTEM_PROMPT = """ 
You are an expert system architect. 
Given a parsed architectural intent, your job is to structure it into a concrete ComponentGraph.

Rules:
1. Assign every component to exactly one layer: 'frontend', 'api', 'service', 'data', or 'infra'.
2. Generate a unique, URL-friendly 'id' for each node based on its name (e.g., 'User Service' -> 'user-service').
3. Write a brief 1-sentence description for each node.
4. Map every relationship to an Edge. Ensure the 'source' and 'target' match the exact 'id' of the nodes.
5. Identify the communication protocol (HTTP, TCP, gRPC, AMQP, etc.) for each edge.
6. Identify the overall architectural pattern (e.g., 'Event-driven microservices').
7. If you spot a potential bottleneck or missing component (like a load balancer or message queue), add it to the 'warnings' list.
8. For the 'type' field, use the LOGICAL component type (e.g., 'frontend-app', 'api-gateway', 'web-server', 'database', 'cache', 'message-queue'). DO NOT use the technology name (like 'React' or 'PostgreSQL') for the 'type' field.

Output ONLY valid JSON matching the provided schema.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "Parsed Intent:\n{parsed_intent_json}")
])

structured_llm = llm.with_structured_output(ComponentGraph)
chain = prompt | structured_llm

def enrich_architecture(parsed_intent: ParsedIntent) -> ComponentGraph:
    """ 
        Takes the ParsedIntent and structures it into a ComponentGraph with layers,IDs,protocols
    """
    logger.info("Starting Architecture Agent")
    
    #Convert the Pydantic Model to JSON string
    intent_json = parsed_intent.model_dump_json(indent = 2)
    logger.debug(f"Passing ParsedIntent to Architecture agent:\n{intent_json}")
    
    start_time = time.time()
    try:
        result = chain.invoke({"parsed_intent_json": intent_json})
        duration = time.time() - start_time
        
        logger.info(f"Architecture Agent completed successfully in {duration:.2f}s")
        logger.info(f"Identified pattern: {result.pattern}")
        logger.info(f"Generated {len(result.nodes)} nodes and {len(result.edges)} edges.")
        
        if result.warnings:
            logger.warning(f"Architectural warnings: {result.warnings}")
            
        return result
    
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Architecture Agent failed after {duration:.2f}s: {str(e)}")
        raise e