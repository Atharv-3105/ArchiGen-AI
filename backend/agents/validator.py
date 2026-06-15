import logging 
from typing import List
from models import ExcalidrawPayload

logger = logging.getLogger(__name__)

def validate_diagram(payload: ExcalidrawPayload) -> List[str]:
    """ 
        Function to check the ExcalidrawPaylod for structural errors
    """
    errors = []
    
    #Index the elements By ID for faster lookup
    elements_by_id = {el.id : el for el in payload.elements}
    
    #Check Arrow Bindings
    for el in payload.elements:
        if el.type == "arrow":
            if el.startBinding and el.startBinding.get('elementId'):
                targetID = el.startBinding['elementId']
                if targetID not in elements_by_id:
                    errors.append(f"Arrow '{el.id}' starts at missing element '{targetID}'.")
            
            if el.endBinding and el.endBinding.get('elementId'):
                targetID = el.endBinding['elementId']
                if targetID not in elements_by_id:
                    errors.append(f"Arrow '{el.id}' ends at missing element '{targetID}'.")
                    
                    
    #Check Text Containers
    for el in payload.elements:
        if el.type == "text" and el.containerId:
            if el.containerId not in elements_by_id:
                
                errors.append(f" Text '{el.id}' is bound to missing container '{el.containerId}'")
            
            elif elements_by_id[el.containerId].type != 'rectangle':
                errors.append(f"Text '{el.id}' is bound to non-rectangle element '{el.containerId}'.")
                
    #Check for Overlaps (Bounding Box Internsection)
    rectangles = [el for el in payload.elements if el.type == 'rectangle']
    
    for i, r1 in enumerate(rectangles):
        for r2 in rectangles[i+1:]:
            
            #Check for Intersection
            if( r1.x < r2.x + r2.width and
                r1.x + r1.width > r2.x and
                r1.y < r2.y + r2.height and
                r1.y + r1.height > r2.y):
                
                errors.append(f"Overlap detected between '{r1.id}' and '{r2.id}'")
                

    if errors:
        logger.warning(f"Validator Agent found {len(errors)} errors: {errors}")
    else:
        logger.info("Validator Agent passsed. Diagram is clean")
        

    return errors