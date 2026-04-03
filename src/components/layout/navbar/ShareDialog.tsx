"use client";

import { CopyIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useApplicationStore } from "@/stores/application";
import { useEditorStore } from "@/stores/editor";

export default function ShareDialog({ className }: { className?: string }) {
    const [shareLink, setShareLink] = useApplicationStore(useShallow(state => [state.shareLink, state.setShareLink]));
    const [value, language] = useEditorStore(useShallow(state => [state.value, state.language]));
    const [loading, setLoading] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className={cn("flex items-center rounded-sm", className)}>
                    <LinkIcon className="size-3.5 rotate-90 text-zinc-300" />
                    <span>Share</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share this code</DialogTitle>
                    <DialogDescription>
                        The generated link will not be updated if you modify the code. You will have to generate a new
                        link.
                    </DialogDescription>
                    {shareLink ? (
                        <>
                            <Separator />
                            <div className="flex items-center gap-x-2">
                                <Button
                                    onClick={() => {
                                        window.navigator.clipboard.writeText(shareLink[0]);
                                        toast("Link copied to clipboard");
                                    }}
                                >
                                    <CopyIcon />
                                </Button>
                                <Input readOnly value={shareLink[0]} className="overflow-scroll font-mono text-sm" />
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                    <DialogFooter>
                        <Button
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);

                                try {
                                    if (shareLink && Date.now() - shareLink[1] < 15_000) {
                                        toast("Please wait a little to generate a new link");
                                        return;
                                    }
                                    const response = await fetch("/api/share", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            language,
                                            content: value,
                                        }),
                                    });

                                    if (!response.ok) {
                                        toast("Failed to generate a share link");
                                        return;
                                    }

                                    const result = (await response.json()) as {
                                        id: string;
                                    };
                                    const link = `${window.location.origin}/share/${result.id}`;

                                    setShareLink(link);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {shareLink ? "Create a new link" : "Create a link"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
