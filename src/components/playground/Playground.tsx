"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import type { editor } from "monaco-editor";
import Editor, { type OnChange, useMonaco } from "@monaco-editor/react";
import { useApplicationStore } from "@/stores/application";
import { useEditorStore } from "@/stores/editor";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { Snippet } from "@/snippets/schema";
import Terminal from "./Terminal";
import { initializeMonaco } from "./monaco";
import SecondaryEditor, { SecondaryEditorType } from "./SecondaryEditor";
import ResizableHandleWrapper from "./ResizableHandleWrapper";
import { transpileTypeScript } from "@/lib/utils";
import useWindowWidth from "@/hooks/useWindowWidth";
import { EDITOR_CHARACTER_LIMIT } from "@/config/constants";

export default function Playground({ snippet }: { snippet?: Snippet }) {
    const [isSnippet, setIsSnipped] = useApplicationStore(useShallow(state => [state.isSnippet, state.setIsSnipped]));
    const { value, language, editor, setValue, setSecondaryValue, setLanguage, setEditor, setSecondaryEditor } =
        useEditorStore();

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const secondaryEditorContainerRef = useRef<HTMLDivElement>(null);
    const [secondaryEditorType, setSecondaryEditorType] = useState(SecondaryEditorType.TranspiledJS);
    const width = useWindowWidth();
    const monaco = useMonaco();
    const pathname = usePathname();
    const router = useRouter();

    const transpile = useCallback(() => {
        return (
            transpileTypeScript(
                secondaryEditorType === SecondaryEditorType.TranspiledJS ? "js" : "declarations",
                value,
            ) || "Failed to transpile"
        );
    }, [value, secondaryEditorType]);

    // Redirect the user to / if coming from a /share/ path
    useEffect(() => {
        if (pathname !== "/") {
            if (snippet) {
                setIsSnipped();
                setLanguage(snippet.language);
                setValue(snippet.content);
            }

            router.replace("/");
        }
    }, [pathname, router, snippet, setValue, setLanguage, setIsSnipped]);

    // If not coming from a /share/ path, load the last code from the local storage
    useEffect(() => {
        if (!snippet && !isSnippet) {
            const content = localStorage.getItem("content");
            const language = localStorage.getItem("language");
            if (content) {
                setValue(content);
            }
            if (language) {
                setLanguage(language);
            }
        }
    }, [isSnippet, setValue, snippet, setLanguage]);

    // Initilialize monaco environment
    useEffect(() => {
        if (monaco) {
            initializeMonaco(monaco);
        }
    }, [monaco]);

    // Save language on change
    useEffect(() => {
        try {
            localStorage.setItem("language", language);
        } catch (err) {
            console.error(err);
        }

        if (language === "typescript") {
            if (!value) {
                setSecondaryValue(null);
            } else {
                setSecondaryValue(transpile());
            }
        }
    }, [value, language, setSecondaryValue, transpile]);

    useEffect(() => {
        if (language === "typescript") {
            if (!value) {
                setSecondaryValue(null);
            } else {
                setSecondaryValue(transpile());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditorChange: OnChange = value => {
        if (value && value.length > EDITOR_CHARACTER_LIMIT) {
            toast("The max amount of code is limited to 2000 characters");
            value = value.slice(0, 2000);
            editor?.setValue(value);
        }

        value ??= "";
        setValue(value);

        try {
            localStorage.setItem("content", value);
        } catch (err) {
            console.error(err);
        }

        if (language === "typescript") {
            if (!value) {
                setSecondaryValue(null);
            } else {
                setSecondaryValue(transpile());
            }
        }
    };

    const getEditorDidMountHandler = (primary: boolean) => (editor: editor.IStandaloneCodeEditor) => {
        if (primary) {
            setEditor(editor);
        } else {
            setSecondaryEditor(editor);
        }

        const containerRef = primary ? editorContainerRef : secondaryEditorContainerRef;
        const updateHeight = () => {
            if (!containerRef.current) return;

            try {
                editor.layout({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            } catch (err) {
                console.error(`Failed to update ${primary ? "primary" : "secondary"} editor layout`, err);
            }
        };

        editor.onDidContentSizeChange(updateHeight);
        updateHeight();
    };

    return (
        <div className="flex h-[calc(100vh-var(--navbar-height)-var(--footer-height))] grow flex-col md:p-2 lg:p-4">
            <ResizablePanelGroup direction="vertical" className="h-screen w-full md:rounded-sm lg:rounded-lg">
                <ResizablePanel defaultSize={75} minSize={10}>
                    <ResizablePanelGroup direction={!width || width > 700 ? "horizontal" : "vertical"}>
                        <ResizablePanel
                            id="primary-editor"
                            order={1}
                            defaultSize={language === "typescript" ? 75 : 100}
                            minSize={10}
                        >
                            <div className="h-full" ref={editorContainerRef}>
                                <Editor
                                    theme="vs-dark"
                                    className="min-h-full grow"
                                    language={language}
                                    value={value}
                                    options={{
                                        padding: { top: 5 },
                                        fontFamily: "Cascadia Code",
                                        fontSize: 14,
                                        minimap: {
                                            enabled: false,
                                        },
                                    }}
                                    onMount={getEditorDidMountHandler(true)}
                                    onChange={handleEditorChange}
                                />
                            </div>
                        </ResizablePanel>

                        {language === "typescript" ? (
                            <>
                                <ResizableHandleWrapper />

                                <ResizablePanel id="secondary-editor" order={2} defaultSize={25} minSize={10}>
                                    <SecondaryEditor
                                        ref={secondaryEditorContainerRef}
                                        secondaryEditorType={secondaryEditorType}
                                        setSecondaryEditorType={setSecondaryEditorType}
                                        getEditorDidMountHandler={getEditorDidMountHandler}
                                    />
                                </ResizablePanel>
                            </>
                        ) : (
                            ""
                        )}
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandleWrapper />

                <ResizablePanel defaultSize={25} minSize={10}>
                    <Terminal />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
