import { SplitPane } from './components/SplitPane';
import { Wand2 } from 'lucide-react';
import { ExcalidrawCanvas } from './components/ExcalidrawCanvas';

function LeftPanel() {

  return (
    <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-primary" />
              Architecture Agent
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              Describe your software system in plain English. Our AI multi-agent pipeline will generate a structured, styled architecture diagram.
            </p>
          </div>
          
          <textarea 
            className="flex-1 w-full bg-zinc-900 border border-border rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
            placeholder="e.g., A microservices architecture with a React frontend, Node.js API gateway, Python user service, Redis cache, and PostgreSQL database..."
          />
          
          <button className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Wand2 className="w-4 h-4" />
            Generate Diagram
          </button>
    </div>
  );
}


function RightPanel() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background relative">
          <ExcalidrawCanvas />
    </div>
  );
};


function App() {
  return (
    <SplitPane 
        leftPanel = {<LeftPanel />}
        rightPanel = {<RightPanel />}
    />
  );
}

export default App;