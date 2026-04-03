"use client";

import { useShallow } from "zustand/react/shallow";
import LoadingThreeDotsPulse from "@/components/loaders/LoadingThreeDotsPulse";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExecutionState, useExecutionStore } from "@/stores/execution";

export default function Terminal() {
    const [executionState, executionResult] = useExecutionStore(
        useShallow(state => [state.executionState, state.executionResult]),
    );

    return (
        <div className="flex h-full flex-col bg-zinc-900 p-2 px-4">
            <div>
                <span className="border-b border-blue-400 text-sm font-light uppercase">Execution Terminal</span>
            </div>
            <div className="relative my-2 grow rounded-md border bg-black/25 px-3 pt-3 text-sm">
                <ScrollArea className="!absolute top-0 right-0 bottom-0 left-0 p-2 px-3">
                    {executionResult ? (
                        <div className="flex flex-col gap-2 text-zinc-200">
                            <div>Code executed in {executionResult.duration}ms</div>
                            <Separator />
                            <div>
                                <div className="font-semibold">Standard Error</div>
                                <div className="font-mono whitespace-pre-wrap">{executionResult.stderr}</div>
                            </div>
                            <Separator />
                            <div>
                                <div className="font-semibold">Standard Output</div>
                                <div className="font-mono whitespace-pre-wrap">{executionResult.stdout}</div>
                            </div>
                        </div>
                    ) : executionState === ExecutionState.Running ? (
                        <LoadingThreeDotsPulse />
                    ) : (
                        <></>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
