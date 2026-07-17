import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { SplitPane } from '../components/SplitPane';
import { ExcalidrawCanvas } from '../components/ExcalidrawCanvas';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useArchitectureStream } from '../hooks/useArchitectureStream';
import { Wand2, Loader2, Sparkles, FileText, X } from 'lucide-react';
import { ExportMenu } from '../components/ExportMenu';
import ReactMarkdown from 'react-markdown';

export default function Dashboard(){
    const { isLoaded, isSignedIn } = useAuth();
    const streamState = useArchitectureStream();
    const [userInput, setUserInput] = useState('');
    const [showADR, setShowADR] = useState(false);

    const { status, currentNode, completedNodes, diagram, error, startGeneration, resetStream } = streamState;
    const isGenerating = status === 'streaming';

    // Wait for Clerk to resolve the user session on refresh
    if (!isLoaded) {
        return (
            <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-zinc-400 font-medium animate-pulse">Loading workspace...</span>
            </div>
        );
    }

    // Redirect to Landing Page if not signed in
    if (!isSignedIn) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = () => {
        const minLen = diagram ? 5 : 10;
        if (userInput.trim().length < minLen) {
            alert(`Please provide at least ${minLen} characters.`);
            return;
        }

        startGeneration(userInput, diagram || undefined);
        setUserInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-border/60 flex items-center justify-between px-6 flex-shrink-0 bg-surface/30 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-violet flex items-center justify-center shadow-md shadow-primary/10">
                        <Wand2 className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-base font-extrabold text-white tracking-tight">ArchiGen AI</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <UserButton 
                        afterSignOutUrl="/" 
                        appearance={{
                            elements: {
                                avatarBox: "w-8.5 h-8.5 rounded-full border border-white/10 hover:border-primary/50 transition-colors"
                            }
                        }}
                    />
                </div>
            </header>

            {/* Split Panel workspace */}
            <div className="flex-1 flex overflow-hidden relative">
                <SplitPane 
                    leftPanel={
                        <div className="p-6 h-full flex flex-col min-h-0 bg-surface/[0.15]">
                            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 px-1 select-none">
                                {diagram ? "Refinement Interface" : "Logical System Spec"}
                            </p>

                            <ProgressIndicator status={status} currentNode={currentNode} completedNodes={completedNodes} error={error} />

                            <div className="flex-1 flex flex-col min-h-0">
                                {/* AI Unified Prompter Container */}
                                <div className="relative flex-1 flex flex-col bg-zinc-950/40 rounded-xl border border-border/80 focus-within:border-primary/50 focus-within:shadow-[0_0_25px_-10px_rgba(99,102,241,0.2)] transition-all p-3.5 glass-panel">
                                    {diagram && (
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2.5 px-1.5 flex items-center gap-1.5 select-none">
                                            <Sparkles className="w-3 h-3 text-primary-accent" /> Refine Current Architecture
                                        </div>
                                    )}
                                    <textarea 
                                        className="flex-1 w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none text-sm leading-relaxed p-1.5 animate-fade-in"
                                        placeholder={diagram ? "e.g. Add a Redis Cache between the API and the DB..." : "e.g. A microservices architecture with a React frontend, Node.js API gateway, Auth service, and PostgreSQL database..."}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isGenerating}
                                    />
                                    <div className="flex items-center justify-between border-t border-white/[0.04] pt-3.5 mt-2.5 px-1">
                                        <span className="text-[10px] text-zinc-500 select-none">
                                            Press Enter to generate, Shift+Enter for new line
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {diagram && (
                                                <button 
                                                    onClick={resetStream}
                                                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold py-2.5 px-4.5 rounded-lg border border-border/80 transition-all hover:border-zinc-700 active:scale-95 cursor-pointer"
                                                    disabled={isGenerating}
                                                    type="button"
                                                >
                                                    New Diagram
                                                </button>
                                            )}
                                            <button 
                                                onClick={handleSubmit}
                                                className="bg-primary hover:bg-primary-hover disabled:bg-zinc-900 disabled:text-zinc-600 disabled:shadow-none text-white text-xs font-bold py-2.5 px-4.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/20 active:scale-95 cursor-pointer"
                                                disabled={isGenerating}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <Loader2 className="w-4.0 h-3.5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : diagram ? (
                                                    <>
                                                        <Sparkles className="w-4.0 h-3.5" />
                                                        Refine
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="w-4.0 h-3.5" />
                                                        Generate
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {diagram?.adr_markdown && (
                                    <button 
                                        onClick={() => setShowADR(true)}
                                        className="mt-4 w-full bg-surface/50 hover:bg-zinc-900 border border-border/80 text-zinc-300 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 glass-panel active:scale-98 shadow-md"
                                    >
                                        <FileText className="w-4.5 h-4.5 text-yellow-500" />
                                        View Architecture Decision Record (ADR)
                                    </button>
                                )}
                            </div>
                        </div>
                    }
                    rightPanel={
                        <div className="h-full w-full bg-[#09090b] relative border-l border-border/5 pt-1">
                            {diagram && (
                                <div className="absolute top-4 right-4 z-10 shadow-lg">
                                    <ExportMenu diagram={diagram} />
                                </div>
                            )}
                            <ExcalidrawCanvas diagram={diagram} />
                        </div>
                    }
                />

                {/* ADR Modal Container */}
                {showADR && diagram?.adr_markdown && (
                    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 md:p-12">
                        <div className="bg-surface border border-border/80 rounded-2xl shadow-2xl shadow-black/80 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden glass-panel">
                            <div className="flex items-center justify-between px-6 py-4.5 border-b border-border/60 bg-white/[0.01]">
                                <h2 className="text-base font-bold text-white flex items-center gap-2.5">
                                    <FileText className="w-5 h-5 text-primary-accent" />
                                    Architecture Decision Record (ADR)
                                </h2>
                                <button 
                                    className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.04] transition-colors" 
                                    onClick={() => setShowADR(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-7 overflow-y-auto prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed scrollbar-thin">
                                <ReactMarkdown>{diagram.adr_markdown}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}