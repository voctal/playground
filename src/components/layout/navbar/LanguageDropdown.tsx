"use client";

import { useShallow } from "zustand/react/shallow";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { languages } from "@/config/constants";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor";
import { ExecutionState, useExecutionStore } from "@/stores/execution";

export default function LanguageDropdown({ className }: { className?: string }) {
    const [language, setLanguage] = useEditorStore(useShallow(state => [state.language, state.setLanguage]));
    const executionState = useExecutionStore(state => state.executionState);

    return (
        <Select
            value={language}
            onValueChange={v => setLanguage(v)}
            disabled={executionState === ExecutionState.Running}
        >
            <SelectTrigger className={cn("w-[180px]", className)}>
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>

                    {languages.map(l => (
                        <SelectItem key={l.value} value={l.value}>
                            {l.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
