"use client";

import { PauseIcon, TriangleIcon } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor";
import { type ExecutionResult, ExecutionState, useExecutionStore } from "@/stores/execution";

export default function ExecutionButton() {
    const [value, language] = useEditorStore(useShallow(state => [state.value, state.language]));
    const [executionState, setExecutionResult, setExecutionState] = useExecutionStore(
        useShallow(state => [state.executionState, state.setExecutionResult, state.setExecutionState]),
    );

    const onRun = async () => {
        setExecutionResult(null);
        setExecutionState(ExecutionState.Running);

        try {
            const response = await fetch(
                `https://plume.voctal.dev/api/exec?language=${encodeURIComponent(
                    language,
                )}&code=${encodeURIComponent(value)}`,
            );

            if (response.status === 429) {
                const retryAfter = response.headers.get("Retry-After");
                toast(`You got rate-limited. Please wait ${retryAfter}s`);
                return;
            }

            if (!response.ok) {
                toast("There was an error trying to execute the code");
                return;
            }

            const result = (await response.json()) as ExecutionResult;
            setExecutionResult(result);
        } catch (err) {
            console.error("Error when running code", err);
        } finally {
            setExecutionState(ExecutionState.Idle);
        }
    };

    return (
        <Button
            variant="outline"
            disabled={executionState === ExecutionState.Running}
            onClick={onRun}
            className="flex items-center rounded-sm"
        >
            {executionState === ExecutionState.Running ? (
                <PauseIcon className="size-3.5 text-zinc-300" />
            ) : (
                <TriangleIcon className="size-3.5 rotate-90 text-zinc-300" />
            )}
            <span>Start</span>
        </Button>
    );
}
