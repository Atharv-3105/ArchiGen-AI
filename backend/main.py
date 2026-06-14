import uuid 
import uvicorn
import time 
import logging 
from logging_config import setup_logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import GenerateRequest, ClarifyRequest, RefineRequest, ExportRequest

from agents.parser import parse_user_input
from agents.architecture import enrich_architecture
from agents.layout import calculate_layout
from agents.style import apply_styles

#Initialize logging at the very start of the application
setup_logging()
logger = logging.getLogger(__name__)

#Intialize FastAPI app
app = FastAPI(
    title = "Architecture AI Backend",
    description = "Diagram Generation from Natural Language input",
    version = "0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status" : "healthy",
        "service" : "archigen-backend",
        "version" : "0.1.0"
    }
    
@app.post("/generate")
async def generate_diagram(request: GenerateRequest):
    """  
        Starts the Agent pipeline for Parser,Architecture Agent. 
    """
    session_id = str(uuid.uuid4())
    logger.info(f"--- Starting generation for session {session_id} ---")
    total_start = time.time()
    
    try:
        #Step 1: Invoke the Parser Agent
        parsed_intent = parse_user_input(request.user_input)
        
        #Step 2: Get the Architecture
        component_graph = enrich_architecture(parsed_intent)
        
        #Step 3: Calculate the Layout
        positioned_graph = calculate_layout(component_graph)
        
        #Step 4: Apply style
        excalidraw_payload = apply_styles(positioned_graph)
        
        total_duration = time.time() - total_start
        logger.info(f"----- Generation pipeline completed in {total_duration:.2f}s")
        
        return {
            "status" : "success",
            "session_id" : session_id,
            "parsed_intent" : parsed_intent.model_dump(),
            "component_graph" : component_graph.model_dump(),
            "positioned_graph": positioned_graph.model_dump(),
            "diagram" : excalidraw_payload.model_dump()
        }
        
    except Exception as e:
        logger.exception("Pipeline failed with an Exception")
        raise HTTPException(
            status_code = 500, detail = f"Pipeline failed: {str(e)}"
        )
    
@app.post("/clarify")
async def clarify_diagram(request: ClarifyRequest):
    """ 
        Resume an interrupted Graph with user clarification answers.
    """
    
    return {
        "status": "skeleton",
        "session_id": request.session_id,
        "message": "Clarification answers received."
    }
    
@app.post("/refine")
async def refine_diagram(request: RefineRequest):
    """  
        Runs the refinement Agent to make surgical updates to an existing diagram.
    """
    
    return {
        "status": "NOT IMPLEMENTED",
        "message": f"Received refinement instruction: '{request.edit_instruction}'"
    }
    
@app.post("/export")
async def export_diagram(request: ExportRequest):
    """ 
        Exports the diagram in the requested format.
    """
    
    return {
        "status": "UNIMPLEMENTED",
        "format": request.format,
        "message": "Export functionality will be  implemented  in Phase 4."
    }


