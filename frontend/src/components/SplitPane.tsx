import React, { useState, useCallback} from 'react';

interface SplitPaneProps {
    leftPanel:  React.ReactNode;
    rightPanel: React.ReactNode;
}

export const SplitPane: React.FC<SplitPaneProps> = ({leftPanel, rightPanel}) => {

    const [isResizing, setIsResizing] = useState(false);
    const [leftWidth, setLeftWidth] = useState(40);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e : React.MouseEvent) => {
        if( !isResizing ) return;
        const containerWidth = e.currentTarget.parentElement?.clientWidth || 1;
        const newLeftWidth = (e.clientX / containerWidth) * 100;

        //constrain resizing between 20% - 80%
        if(newLeftWidth > 20 && newLeftWidth < 80){
            setLeftWidth(newLeftWidth);
        }
    }, [isResizing]);

    return (
        <div    
            className= {`flex h-full w-full overflow-hidden ${isResizing ? 'cursor-col-resize select-none' : ''}`}
            onMouseMove={resize}
            onMouseUp = {stopResizing}
            onMouseLeave = {stopResizing}
        >
            <div 
                className= "h-full bg-surface border-r border-border overflow-y-auto flex flex-col"
                style = {{width: `${leftWidth}%`}}
            >
                {leftPanel}
            </div>

            <div
                className="w-1 bg-border hover:bg-primary cursor-col-resize transition-colors flex-shrink-0 z-10"
                onMouseDown={startResizing}
                title="Drag to resize"
            />

            <div 
                className= "h-full bg-background flex-1 overflow-hidden relative"
                style = {{ width: `${100 - leftWidth}%` }}
            >
                {rightPanel}
            </div>
        </div>
    );
};