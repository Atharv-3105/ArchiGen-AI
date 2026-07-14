import { useState, useCallback } from 'react';
import { validateAndParseDiagram, type DiagramPayload } from '../lib/schema';
import { useAuth } from '@clerk/clerk-react';


type StreamStatus = 'idle' | 'streaming' | 'complete' | 'error';

interface StreamState {
    status: StreamStatus;
    currentNode: string | null;
    completedNodes: string[];
    diagram: DiagramPayload | null;
    error: string | null;
}

export function useArchitectureStream() {

    //Define the token function
    const { getToken } = useAuth();
    const [state, setState ] = useState<StreamState>({
        status: 'idle',
        currentNode: null,
        completedNodes: [],
        diagram: null,
        error: null,
    });

    const startGeneration = useCallback(async (userInput: string, existingDiagram?: DiagramPayload) => {
        //Reset the state for a new Generation/Refinement
        setState(prev => ({
            ...prev,
            status: 'streaming',
            currentNode: null,
            completedNodes: [],
            error: null,
            diagram: existingDiagram || null,
        }));

        try {
            
            //Fetch the JWT token from Clerk
            const token = await getToken();
            if(!token){
                throw new Error("Authentication Required.Please sign in.");
            }

            //Route to /refine if we have an existing diagram
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
            const url = existingDiagram ? `${backendURL}/refine` : `${backendURL}/generate`;
            const body = existingDiagram ? 
                         JSON.stringify({diagram_payload: existingDiagram, edit_instruction: userInput})
                        :JSON.stringify({ user_input: userInput });

            
            console.log(`Starting ${existingDiagram ? 'Refinement' : 'Generation'} Request...`);
            console.log('Sending payload to', url, body);

            //get the Response from the backend
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": 'application/json', "Authorization" : `Bearer ${token}`},
                body,
            });

            if(!response.ok) {
                const errorBody = await response.text();
                console.error('Backend Error body:', errorBody);
                throw new Error(`Backend returned HTTP ${response.status}`);
            }

            const reader = response.body?.getReader();
            if(!reader) throw new Error('No response body to read');

            const decoder = new TextDecoder();
            let buffer = '';
            let eventsReceived = 0;

            //Read the StreamRespons chunk-by-chunk
            while(true) {
                const { done, value} = await reader.read();
                if (done){
                    console.log("Stream Completed.");
                    break;
                };

                buffer += decoder.decode(value, {stream: true});

                // SSE events are separated by (\n\n)
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || ''; //Keep the last incomplete chunk in the buffer

                for (const line of lines) {
                    if(line.startsWith('data: ')) {

                        const jsonStr = line.slice(6);
                        eventsReceived++;
                        console.log(`Event ${eventsReceived}:`, jsonStr.substring(0, 100) + '....');
                        try {

                            const event = JSON.parse(jsonStr);

                            if(event.event === 'node_complete') {
                                console.log(`Node Complete: ${event.node}`);
                                setState(prev => ({
                                    ...prev,
                                    currentNode: event.node,
                                    completedNodes: [...prev.completedNodes, event.node],
                                }));
                            } else if(event.event === 'diagram_ready') {

                                console.log('Diagram ready! Elements:', event.payload?.elements?.length);

                                //Validate the Payload with the Zod Schema before rendering it
                                const validatedDiagram = validateAndParseDiagram(event.payload);
                                setState(prev => ({
                                    ...prev,
                                    status: 'complete',
                                    currentNode: null,
                                    diagram: validatedDiagram,
                                }));
                            } else if( event.event === 'error') {

                                console.error('Error event:', event.message);
                                setState(prev => ({
                                    ...prev,
                                    status: 'error',
                                    error: event.message,
                                }));
                            }
                        } catch(err) {
                            console.error('Failed to parse SSE event:', jsonStr, err);
                        }
                    }
                }
            }

            //If the Steam Ends without diagram_ready or error_event, mark it as ERROR
            setState(prev => {
                if (prev.status === 'streaming') {
                    console.warn('Stream ended without diagram_ready or error event');
                    return {
                        ...prev,
                        status: 'error',
                        error: 'Stream ended unexpectedly'
                    }
                }
                return prev;
            });
        } catch (err) {
            console.error("NETWORK ERROR:", err);
            setState(prev => ({
                ...prev, 
                status: 'error',
                error: err instanceof Error ? err.message : 'An unknown network error occured',
            }));
        }
    }, [getToken]);

    const resetStream = useCallback(() => {
        setState({
            status: 'idle',
            currentNode: null,
            completedNodes: [],
            diagram: null,
            error: null,
        });
    }, []);

    return { ...state, startGeneration, resetStream };
}