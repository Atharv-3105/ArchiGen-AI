import React, {useState} from "react";
import {Download, FileText, Code, Image, FileCode, X} from 'lucide-react';
import type { DiagramPayload } from "../lib/schema";
import { exportToBlob, exportToSvg } from "@excalidraw/excalidraw";

interface ExportMenuProps {
    diagram: DiagramPayload;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ diagram }) => {

    const [isOpen, setIsOpen] = useState(false);

    const downloadFile = (content: string | Blob, filename: string, mimetype: string) => {
        const blob = content instanceof Blob ? content: new Blob([content], {type: mimetype});
        
        //Create a in-browser memory download engine with anchor tag
        const url  = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExport = async (format: string) => {
        try {
            switch (format) {
                case 'json':
                    downloadFile(JSON.stringify(diagram, null, 2), 'diagram.excalidraw', 'application/json');
                    break;
                
                case 'markdown':
                    downloadFile(diagram.adr_markdown || '# No ADR Available', 'ADR.md', 'text/markdown');
                    break;

                case 'mermaid':
                    downloadFile(`\`\`\`mermaid\n${diagram.mermaid_code || 'graph TD; A-->B;'}\n\`\`\``, 'diagram.md', 'text/plain');
                    break;
                
                case 'png':
                    const blob = await exportToBlob({
                        elements: diagram.elements as any, 
                        appState: { ...diagram.appState, exportBackground: true},
                        files: null, 
                    });
                    downloadFile(blob, 'diagram.png', 'image/png');
                    break;
                
                case 'svg':
                    const svg = await exportToSvg({
                        elements: diagram.elements as any,
                        appState: { ...diagram.appState, exportBackground: true},
                        files: null,
                    });

                    //Serialize svgElement 
                    const svgString = new XMLSerializer().serializeToString(svg);
                    downloadFile(svgString, 'diagram.svg', 'image/svg+xml');
                    break;
            }
        } catch (error) {
            console.error("Export failed: ", error);
            alert("Failed to export diagram. Check console for details.");
        } finally {
            setIsOpen(false);
        }
    };


    return (
        <div className="relative">
            <button 
                    onClick = {() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-surface hover:bg-zinc-800 border border-border text-zinc-300 text-sm font-medium py-2 px-3 rounded-md transition-colors"
            >
                <Download className = "w-4 h-4" />
                Export 
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-border flex justify-between items-center">
                        <span className="text-xs font-semibold text-zinc-400 uppercase">Download As</span>
                        <button className="text-zinc-500 hover:text-white" onClick={() => setIsOpen(false)}>
                            <X className = "w-3 h-3" />
                        </button>
                    </div>

                    <div className="p-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors" onClick={() => handleExport('png')}>
                            <Image className="w-4 h-4 text-blue-400" /> PNG Image
                        </button>

                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors" onClick = {() => handleExport('svg')}>
                            <Code className="w-4 h-4 text-pink-400" /> SVG Vector 
                        </button>

                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors" onClick = {() => handleExport('json')}>
                            <FileCode className="w-4 h-4 text-green-400" /> Excalidraw(.JSON) 
                        </button>

                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors" onClick = {() => handleExport('mermaid')}>
                            <Code className="w-4 h-4 text-purple-400" /> Mermaid 
                        </button>

                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors" onClick = {() => handleExport('markdown')}>
                            <FileText className="w-4 h-4 text-yellow-400" /> Markdown 
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}