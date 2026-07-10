import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface ProgressIndicatorProps {
    status: 'idle' | 'streaming' | 'complete' | 'error';
    currentNode: string | null;
    completedNodes: string[];
    error: string | null;
}

const STEPS = [
    {
        id: 'parser', label: 'Parsing Intent'
    },
    {
        id: 'architecture', label: 'Designing Architecture'
    },
    {
        id: 'layout', label: 'Calculating Layout'
    },
    {
        id: 'style', label: 'Applying Styles'
    },
    {
        id: 'validator', label: 'Validating Diagram'
    },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({status, currentNode, completedNodes, error}) => {
    if (status === 'idle') return null;

    return (
        <div className="bg-surface/50 border border-border/80 rounded-xl p-5 mb-5 glass-panel shadow-lg shadow-black/20">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Generation Progress
            </h3>
            
            <div className="relative pl-1">
                {/* Connecting Timeline Line */}
                <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-zinc-800/80" />

                <ul className="space-y-4">
                    {STEPS.map((step) => {
                        const isCompleted = completedNodes.includes(step.id);
                        const isCurrent = currentNode === step.id;

                        return (
                            <li key={step.id} className="flex items-center gap-4 text-sm relative z-10">
                                {isCompleted ? (
                                    <div className="w-6 h-6 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center shadow-lg shadow-accent-emerald/5">
                                        <Check className="w-3.5 h-3.5 text-accent-emerald" />
                                    </div>
                                ) : isCurrent ? (
                                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center relative shadow-lg shadow-primary/10">
                                        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75" />
                                        <Loader2 className="w-3.5 h-3.5 text-primary-accent animate-spin z-10" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-border/50 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                    </div>
                                )}
                                <span className={
                                    isCompleted 
                                        ? 'text-zinc-500 line-through decoration-zinc-700/50 transition-all duration-300' 
                                        : isCurrent 
                                            ? 'text-white font-semibold transition-all duration-300 bg-gradient-to-r from-white to-zinc-300 bg-clip-text' 
                                            : 'text-zinc-600 transition-all duration-300'
                                }>
                                    {step.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {status === 'error' && error && (
                <div className="mt-5 p-3.5 bg-accent-rose/10 border border-accent-rose/25 rounded-lg flex items-start gap-2.5 shadow-lg shadow-accent-rose/5">
                    <AlertCircle className="w-4 h-4 text-accent-rose flex-shrink-0 mt-0.5 animate-bounce" />
                    <p className="text-xs text-accent-rose font-medium leading-relaxed"> {error}</p>
                </div>
            )}
        </div>
    );
};