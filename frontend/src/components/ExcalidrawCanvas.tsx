import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { useEffect, useCallback, useState } from 'react';
import {type DiagramPayload } from '../lib/schema';

import "@excalidraw/excalidraw/index.css";

interface ExcalidrawCanvasProps {
  diagram: DiagramPayload | null;
}


export const ExcalidrawCanvas: React.FC<ExcalidrawCanvasProps> = ({ diagram }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateCanvas = useCallback((newDiagram: DiagramPayload) => {
    if(!excalidrawAPI) {
      console.warn('Excalidraw API not ready yet.');
      return;
    }

    console.log('Updating canvas with', newDiagram.elements.length, 'elements');

    //Use Excalidraw API to update the scene
    excalidrawAPI.updateScene({
      elements: newDiagram.elements as any,
      appState: {
        ...newDiagram.appState,
        viewBackgroundColor: newDiagram.appState?.viewBackgroundColor || '#09090b',
        theme: 'dark',
      },
      scrollToContent: true,
    });
  }, [excalidrawAPI]);

  //Initialize canvas when Excalidraw API is ready
  useEffect(() => {
    if(excalidrawAPI && !isInitialized) {
      console.log("Excalidraw API initialized");
      setIsInitialized(true);
    }
  }, [excalidrawAPI, isInitialized]);

  //Force re-render when diagram changes
  useEffect(() => {
    if( diagram && isInitialized) {

      console.log("New diagram detected, forcing canvas re-render...");
      console.log("Diagram Elements:", diagram.elements);
      updateCanvas(diagram)
    }
  }, [diagram, isInitialized, updateCanvas]);

  //Scroll to content when a new diagram is loaded
  useEffect(() => {
    if (excalidrawAPI && diagram) {
      setTimeout(() => {
        excalidrawAPI.scrollToContent(diagram.elements as any[], {
          fitToViewport: true,
          viewportZoomFactor: 0.8,
        });
      }, 100);
    }
  }, [excalidrawAPI, diagram]);

  //Empty State check
  if(!diagram) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background text-zinc-500">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface/50 border border-border/80 flex items-center justify-center glass-panel shadow-lg shadow-black/10">
            <svg className="w-8 h-8 text-primary/60 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-zinc-300">Diagram Canvas</p>
          <p className="text-sm mt-2 max-w-xs mx-auto text-zinc-500 leading-relaxed">
            Your interactive Excalidraw canvas will render here once the AI Agent pipeline generates the layout.
          </p>
        </div>
      </div>
    );
  }
  return (
    //Force a key so that remount is acknowledged when a new diagram arrives
    <div className="h-full w-full">
      <Excalidraw
          initialData={{
            elements: diagram.elements as any,
            appState: diagram.appState as any,
            scrollToContent: true,
          }}
          theme='dark'
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
              export: false, 
              saveAsImage: false,
            },
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.Help />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
          </WelcomeScreen>
        </Excalidraw>
    </div>
  );
};