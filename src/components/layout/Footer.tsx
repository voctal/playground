"use client";

import type { Position } from "monaco-editor";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor";
import { ExecutionState, useExecutionStore } from "@/stores/execution";

export default function Footer() {
    const editor = useEditorStore(state => state.editor);
    const executionState = useExecutionStore(state => state.executionState);
    const [position, setPosition] = useState<Position | null>(null);

    useEffect(() => {
        if (!editor) {
            return;
        }
        if (!position) {
            const newPosition = editor.getPosition();
            if (newPosition) {
                setPosition(newPosition);
            }
        }
        const listener = editor?.onDidChangeCursorPosition(e => {
            setPosition(e.position);
        });
        return () => listener?.dispose();
    }, [editor, position]);

    return (
        <footer
            className={cn(
                "flex h-[var(--footer-height)] items-center justify-end border-t border-zinc-700 bg-zinc-900 px-4 transition",
                executionState === ExecutionState.Running ? "bg-orange-400" : "",
            )}
        >
            <div className="text-sm text-zinc-300">
                Ln {position?.lineNumber}, Col {position?.column}
            </div>
        </footer>
    );
}
