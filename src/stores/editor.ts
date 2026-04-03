import type { editor } from "monaco-editor";
import { create } from "zustand";

export interface EditorStore {
    language: string;
    value: string;
    editor: editor.IStandaloneCodeEditor | null;
    secondaryValue: string | null;
    secondaryEditor: editor.IStandaloneCodeEditor | null;
    setValue: (value: string) => void;
    setLanguage: (language: string) => void;
    setEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
    setSecondaryValue: (secondaryValue: string | null) => void;
    setSecondaryEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
}

export const useEditorStore = create<EditorStore>(set => ({
    language: "typescript",
    value: `import { randomUUID, randomBytes } from "node:crypto";

export class Generator {
    public id(): string {
        return randomUUID();
    }

    public token(): string {
        return randomBytes(24).toString("hex");
    }
}

const generator = new Generator();

console.log("Generated UUID v4:", generator.id());
console.log("Generated Token:", generator.token());
`,
    editor: null,
    secondaryValue: null,
    secondaryEditor: null,
    setValue: (value: string) => set(() => ({ value })),
    setLanguage: (language: string) => set(() => ({ language })),
    setEditor: (editor: editor.IStandaloneCodeEditor | null) => set(() => ({ editor })),
    setSecondaryValue: (secondaryValue: string | null) => set(() => ({ secondaryValue })),
    setSecondaryEditor: (editor: editor.IStandaloneCodeEditor | null) => set(() => ({ secondaryEditor: editor })),
}));
