import logging 
import networkx as nx 
from networkx.drawing.nx_pydot import graphviz_layout
from models import ComponentGraph, PositionedGraph, PositionedNode
import pydot 
from networkx.drawing.nx_pydot import to_pydot


logger = logging.getLogger(__name__)

#Define the fixed left-to-right flow of our architecture layers
LAYER_ORDER = ["frontend", "api", "service", "data", "infra"]

#Canvas Spacing and Scaling
SCALE_FACTOR = 1.0 #Scale GraphViz coordinates to Excaildraw pixels 
OFFSET_X = 100
OFFSET_Y = 100
MIN_NODE_SPACING = 150 #Clear bounds to prevent box collisions

def calculate_layout(graph: ComponentGraph) -> PositionedGraph:
    """ 
        Takes ComponentGraph and assigns X/Y coordinates:
        1- Using NetworkX for math
        2- Graphviz dot algorithm for heirarchial layout
    """
    
    logger.info("Starting Layout Agent(NetworkX + Graphviz via Pydot)...")
    
    #Build NetworkX DiGraph
    G = nx.DiGraph()
    
    #Add nodes with layer attributes
    for node in graph.nodes:
        G.add_node(node.id, layer=node.layer, data = node)
        
    #Add edges into our NetworkX DiGraph
    for edge in graph.edges:
        G.add_edge(edge.source, edge.target, label = edge.label)
    
    #Validate graph structure using NetworkX
    _validate_graph(G)
    
    #Convert to pydot and create Rank subgraphs
    logger.info("Creating rank subgraphs for layered layout..")
    P = _create_ranked_pydot_graph(G)
    
    #Calculate layout using 'dot' algorithm
    logger.info("Computing heirarchical layout with GraphVis 'dot' algorithm...")
    
    try:
        P.set('rankdir', 'LR')
        P.set('nodesep', '1.0')
        P.set('ranksep', '2.0')
        
        #Create a temporary graph from the modified pyDot
        G_ranked = nx.nx_pydot.from_pydot(P)
        pos = nx.nx_pydot.graphviz_layout(G_ranked, prog = 'dot')
        
        logger.info(f"Graphviz computed positions for {len(pos)} nodes")
        
    except Exception as e:
        
        logger.warning(f"Graphviz layout failed ({str(e)}), falling back to manual layered layout...")
        
        #Fallback to NetworkX spring layout if GraphVis fails
        pos = _manual_layered_layout(G)
        
    #Convert Graphviz positions to Excalidraw Coordinates
    positioned_nodes = _convert_positions(G, pos)
    
    logger.info(f"Layout Agent completed. Positioned {len(positioned_nodes)} nodes.")
    
    return PositionedGraph(
        nodes = positioned_nodes,
        edges = graph.edges,
        pattern = graph.pattern,
        warnings = graph.warnings
    )
    
def _create_ranked_pydot_graph(G: nx.DiGraph) -> pydot.Dot:
    P = nx.nx_pydot.to_pydot(G)
    
    #Group the nodes by layer
    layers = {}
    for node_id in G.nodes():
        layer = G.nodes[node_id].get('layer', 'unknown')
        if layer not in layers:
            layers[layer] = []
        layers[layer].append(node_id)
        
    #Create subgraphs for each layer with rank = same
    for layer in LAYER_ORDER:
        if layer in layers:
            #Create a subGraph for this Layer
            subgraph = pydot.Subgraph(graph_name = f'cluster_{layer}')
            subgraph.set('rank', 'same')
            
            #Add all nodes of this layer to the subGraph
            for node_id in layers[layer]:
                
                #Find the node in the pydot graph
                pydot_nodes = P.get_node(f'"{node_id}"')
                if not pydot_nodes:
                    pydot_nodes = P.get_node(node_id)
                
                if not pydot_nodes:
                    subgraph.add_node(pydot_nodes[0])
            
            P.add_subgraph(subgraph)
            logger.debug(f"Created rank subgraph for layer '{layer}' with {len(layers[layer])} nodes")
            
    
    return P

def _manual_layered_layout(G: nx.DiGraph) -> dict:
    """
    Fallback manual layout if Graphviz fails.
    Assigns X based on layer, Y based on position within layer.
    """
    pos = {}
    layer_counts = {layer: 0 for layer in LAYER_ORDER}
    
    for node_id in G.nodes():
        layer = G.nodes[node_id].get('layer', 'unknown')
        
        if layer in LAYER_ORDER:
            layer_idx = LAYER_ORDER.index(layer)
        else:
            layer_idx = 0
        
        node_idx = layer_counts[layer]
        
        # X based on layer, Y based on position within layer
        x = layer_idx * 300
        y = node_idx * 200
        
        pos[node_id] = (x, y)
        layer_counts[layer] += 1
    
    return pos
    
    
    
def _validate_graph(G: nx.DiGraph):
    
    #Check for weak connectivity
    if len(G.nodes) > 1 and not nx.is_weakly_connected(G):
        logger.warning("Graph has disconnected components!")
        components = list(nx.weakly_connected_components(G))
        for i, component in enumerate(components):
            logger.warning(f" Component {i + 1}: {component}")
            
    #Check for Cycles
    if not nx.is_directed_acyclic_graph(G):
        cycles = list(nx.simple_cycles(G))
        logger.warning(f"Graph contains {len(cycles)} cycles")
        
        #Show first 3 cycles
        for cycle in cycles[:3]:
            logger.warning(f"  {'->'.join(cycle)}")
            
    
    #Check for isolated nodes(no edges)
    isolated_nodes = list(nx.isolates(G))
    if isolated_nodes:
        logger.warning(f"Found {len(isolated_nodes)} isolated node(s) with no connections: {isolated_nodes}")
        
def _convert_positions(G: nx.DiGraph, pos:dict) -> list[PositionedNode]:
    """ 
        Converts Graphviz/Networkx positions to Excalidraw-friendly coordinates.
        Applies scaling, offset, and collision avoidance
    """
    
    positioned_nodes = []
    
    if not pos:
        logger.error("No positions computed")
        return []
    
    min_x = min(p[0] for p in pos.values())
    min_y = min(p[1] for p in pos.values())
    
    #Track occupied positoins to avoid overlaps
    layer_y_positions = {}
    
    for node_id, (x, y) in pos.items():
        
        node_data = G.nodes[node_id]['data']
        layer = node_data.layer
        
        #Scale and offset the coordinates
        scaled_x = OFFSET_X + (x - min_x) * SCALE_FACTOR
        scaled_y = OFFSET_Y + (y - min_y) * SCALE_FACTOR
        
        #Compute collision avoidance within the same layer
        if layer not in layer_y_positions:
            layer_y_positions[layer] = []
            
        for existing_y in layer_y_positions[layer]:
            if abs(scaled_y - existing_y) < MIN_NODE_SPACING:
                scaled_y = existing_y + MIN_NODE_SPACING
                logger.debug(f"Adjusted {node_id} Y Position to avoid overlap")
        
        layer_y_positions[layer].append(scaled_y)
        
        positioned_nodes.append(PositionedNode(
            id = node_id,
            name = node_data.name,
            type = node_data.type,
            layer = layer,
            description = node_data.description,
            x = round(scaled_x, 2),
            y = round(scaled_y, 2)
        ))
        
    #Sort nodes by layer and then by Y position for consistency
    positioned_nodes.sort(key = lambda n : (LAYER_ORDER.index(n.layer) if n.layer in LAYER_ORDER else 99, n.y))
    
    return positioned_nodes