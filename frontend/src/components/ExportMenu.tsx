import React, {useState} from "react";
import {Download, FileText, Code, Image, X, ExternalLink} from 'lucide-react';
import type { DiagramPayload } from "../lib/schema";
import { exportToBlob, exportToSvg } from "@excalidraw/excalidraw";

interface ExportMenuProps {
    diagram: DiagramPayload;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ diagram }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const downloadFile = (content: string | Blob, filename: string, mimetype: string) => {
        const blob = content instanceof Blob ? content: new Blob([content], {type: mimetype});
        
        //Create an in-browser memory download engine with anchor tag
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
        setIsExporting(true);
        try {
            switch (format) {
                case 'json':{

                    //Wrap the payload in official Excalidraw file signature
                    const excalidrawFile = {
                        type: "excalidraw",
                        version: 2,
                        source: "https://archigenai.vercel.app",
                        elements: diagram.elements,
                        appState: {
                            ...diagram.appState,
                            viewBackgroundColor: diagram.appState?.viewBackgroundColor || "#ffffff",
                            gridSize: null,
                            scrollX: 0,
                            scrollY: 0,
                            zoom: {value: 1},
                        },
                        files: {}
                    };

                    //A try-catch block to build a base64 encoded URL with diagram details and directly open the Excalidraw Website
                    try {
                        //stringigy the Excalidraw Payload and Base64 encode
                        const jsonString = JSON.stringify(excalidrawFile)
                        const base64Data = btoa(decodeURIComponent(encodeURIComponent(jsonString)));

                        //Construct the Excalidraw URL with the payload
                        const excalidrawURL = `https://excalidraw.com/#json=${base64Data}`;

                        window.open(excalidrawURL, '_blank');
                    }catch (error) {
                        console.error("Failed to encode Excalidraw URL(possibly too large). Falling back to download.", error)
                        
                        //Fallback: If DirectURL opening fails, fallback to download the .excalidraw payload so that User can manually upload it
                        downloadFile(JSON.stringify(excalidrawFile, null, 2), 'diagram.excalidraw', 'application/json');
                    }
                    break;
                }

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
            setIsExporting(false);
            setIsOpen(false);
        }
    };


    return (
        <div className="relative">
            <button 
                onClick = {() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-surface/80 hover:bg-zinc-900 border border-border/80 text-zinc-300 text-sm font-medium py-2.5 px-4 rounded-lg transition-all active:scale-95 glass-panel btn-shine glow-zinc btn-icon-float"
            >
                <Download className = "w-4 h-4" />
                Export 
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-surface/90 border border-border/80 rounded-xl shadow-2xl z-50 overflow-hidden glass-panel origin-top-right transition-all duration-200">
                    <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center bg-white/[0.01]">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Download As</span>
                        <button className="text-zinc-500 hover:text-zinc-300 transition-colors btn-icon-spin" onClick={() => setIsOpen(false)}>
                            <X className = "w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                        <button 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all btn-icon-shift" 
                            onClick={() => handleExport('png')}
                        >
                            <Image className="w-4 h-4 text-blue-400" /> PNG Image
                        </button>

                        <button 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all btn-icon-shift" 
                            onClick = {() => handleExport('svg')}
                        >
                            <Code className="w-4 h-4 text-pink-400" /> SVG Vector 
                        </button>

                        <button 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all btn-icon-shift" 
                            onClick = {() => handleExport('json')}
                        >
                            <ExternalLink className="w-4 h-4 text-accent-emerald" /> Open in Excalidrawa
                        </button>

                        <div className="h-[1px] bg-border/50 my-1 mx-2" />

                        <button 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all btn-icon-shift" 
                            onClick = {() => handleExport('mermaid')}
                        >
                            <Code className="w-4 h-4 text-purple-400" /> Mermaid Code
                        </button>

                        <button 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all btn-icon-shift" 
                            onClick = {() => handleExport('markdown')}
                        >
                            <FileText className="w-4 h-4 text-yellow-500" /> Markdown ADR
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}