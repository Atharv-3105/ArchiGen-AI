import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { useEffect, useState } from 'react';
import { validateAndParseDiagram, type DiagramPayload } from '../lib/schema';

// Simulated raw, untyped JSON response from the AI Agent Pipeline
const mockAIResponse: unknown = {
  elements: [
    // 1. Frontend Node
    { id: 'node-frontend', type: 'rectangle', x: 50, y: 100, width: 200, height: 100, angle: 0, strokeColor: '#3b82f6', backgroundColor: '#dbeafe', fillStyle: 'solid', strokeWidth: 2, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: { type: 3 }, seed: 123456789, version: 1, versionNonce: 987654321, isDeleted: false, boundElements: [{ id: 'arrow-1', type: 'arrow' }], updated: 1690000000000, link: null, locked: false },
    // 2. Frontend Text
    { id: 'text-frontend', type: 'text', x: 60, y: 140, width: 180, height: 31, angle: 0, strokeColor: '#1e3a8a', backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 1, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: null, seed: 123456790, version: 1, versionNonce: 987654322, isDeleted: false, boundElements: null, updated: 1690000000000, link: null, locked: false, fontSize: 20, fontFamily: 1, text: 'React Frontend', textAlign: 'center', verticalAlign: 'middle', containerId: 'node-frontend', originalText: 'React Frontend', autoResize: true, lineHeight: 1.25 },
    // 3. API Node
    { id: 'node-api', type: 'rectangle', x: 350, y: 100, width: 200, height: 100, angle: 0, strokeColor: '#ca8a04', backgroundColor: '#fef9c3', fillStyle: 'solid', strokeWidth: 2, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: { type: 3 }, seed: 123456791, version: 1, versionNonce: 987654323, isDeleted: false, boundElements: [{ id: 'arrow-1', type: 'arrow' }, { id: 'arrow-2', type: 'arrow' }], updated: 1690000000000, link: null, locked: false },
    // 4. API Text
    { id: 'text-api', type: 'text', x: 380, y: 140, width: 140, height: 31, angle: 0, strokeColor: '#713f12', backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 1, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: null, seed: 123456792, version: 1, versionNonce: 987654324, isDeleted: false, boundElements: null, updated: 1690000000000, link: null, locked: false, fontSize: 20, fontFamily: 1, text: 'Node.js API', textAlign: 'center', verticalAlign: 'middle', containerId: 'node-api', originalText: 'Node.js API', autoResize: true, lineHeight: 1.25 },
    // 5. Database Node
    { id: 'node-db', type: 'rectangle', x: 650, y: 100, width: 200, height: 100, angle: 0, strokeColor: '#db2777', backgroundColor: '#fce7f3', fillStyle: 'solid', strokeWidth: 2, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: { type: 3 }, seed: 123456793, version: 1, versionNonce: 987654325, isDeleted: false, boundElements: [{ id: 'arrow-2', type: 'arrow' }], updated: 1690000000000, link: null, locked: false },
    // 6. Database Text
    { id: 'text-db', type: 'text', x: 690, y: 140, width: 120, height: 31, angle: 0, strokeColor: '#831843', backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 1, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: null, seed: 123456794, version: 1, versionNonce: 987654326, isDeleted: false, boundElements: null, updated: 1690000000000, link: null, locked: false, fontSize: 20, fontFamily: 1, text: 'PostgreSQL', textAlign: 'center', verticalAlign: 'middle', containerId: 'node-db', originalText: 'PostgreSQL', autoResize: true, lineHeight: 1.25 },
    // 7. Arrow 1
    { id: 'arrow-1', type: 'arrow', x: 250, y: 150, width: 100, height: 0, angle: 0, strokeColor: '#52525b', backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 2, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: { type: 2 }, seed: 123456795, version: 1, versionNonce: 987654327, isDeleted: false, boundElements: null, updated: 1690000000000, link: null, locked: false, startBinding: { elementId: 'node-frontend', focus: 0, gap: 1 }, endBinding: { elementId: 'node-api', focus: 0, gap: 1 }, points: [[0, 0], [100, 0]], lastCommittedPoint: null, startArrowhead: null, endArrowhead: 'arrow' },
    // 8. Arrow 2
    { id: 'arrow-2', type: 'arrow', x: 550, y: 150, width: 100, height: 0, angle: 0, strokeColor: '#52525b', backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 2, strokeStyle: 'solid', roughness: 1, opacity: 100, roundness: { type: 2 }, seed: 123456796, version: 1, versionNonce: 987654328, isDeleted: false, boundElements: null, updated: 1690000000000, link: null, locked: false, startBinding: { elementId: 'node-api', focus: 0, gap: 1 }, endBinding: { elementId: 'node-db', focus: 0, gap: 1 }, points: [[0, 0], [100, 0]], lastCommittedPoint: null, startArrowhead: null, endArrowhead: 'arrow' },
  ],
  appState: {
    viewBackgroundColor: '#09090b',
    theme: 'dark',
  }
};

export const ExcalidrawCanvas = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [diagram, setDiagram] = useState<DiagramPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Validate the mock AI response through our Zod schema
      const validatedDiagram = validateAndParseDiagram(mockAIResponse);
      setDiagram(validatedDiagram);
      console.log('✅ Diagram validated successfully! Type-safe payload:', validatedDiagram);
    } catch (err) {
      console.error('❌ Validation error:', err);
      setError(err instanceof Error ? err.message : 'Unknown validation error');
    }
  }, []);

  useEffect(() => {
    if (excalidrawAPI && diagram) {
      // Force scroll to content after initialization
      setTimeout(() => {
        excalidrawAPI.scrollToContent(diagram.elements as any[], {
          fitToViewport: true,
          viewportZoomFactor: 0.8,
        });
      }, 100);
    }
  }, [excalidrawAPI, diagram]);

  // Error State UI
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background text-red-500 p-8 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Diagram Validation Failed</h2>
          <p className="text-sm text-zinc-400 max-w-lg">{error}</p>
        </div>
      </div>
    );
  }
  // Loading State UI
  if (!diagram) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background text-zinc-400">
        Validating diagram schema...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Excalidraw
        initialData={{
          // BOUNDARY CASTING: We cast to 'any' here ONLY to satisfy Excalidraw's 
          // strict internal component props. Our internal state remains 100% strictly typed via Zod.
          elements: diagram.elements as any, 
          appState: diagram.appState as any,
          scrollToContent: true,
        }}
        theme="dark"
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