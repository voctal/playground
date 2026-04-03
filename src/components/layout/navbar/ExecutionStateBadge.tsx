"use client";

import { MoonIcon, TriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { ExecutionState, useExecutionStore } from "@/stores/execution";

export default function ExecutionStateBadge() {
    const [executionState, executionStart] = useExecutionStore(
        useShallow(state => [state.executionState, state.executionStart]),
    );
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (executionStart === null) return;

        const interval = setInterval(() => {
            setElapsedTime((Date.now() - executionStart) / 1000);
        }, 100);

        return () => clearInterval(interval);
    }, [executionStart]);

    return (
        <div
            className={cn(
                "flex items-center gap-2 rounded-full border border-yellow-500 bg-yellow-500/30 p-0.5 px-3 transition",
                executionState === ExecutionState.Running ? "border-green-400 bg-green-400/30" : "",
            )}
        >
            {executionState === ExecutionState.Running ? (
                <TriangleIcon className="size-3 rotate-90 text-zinc-100" />
            ) : (
                <MoonIcon className="size-3 text-zinc-100" />
            )}
            <span className="text-sm">
                {executionState === ExecutionState.Running ? `Running (${elapsedTime.toFixed(1)}s)` : "Idle"}
            </span>
        </div>
    );
}
