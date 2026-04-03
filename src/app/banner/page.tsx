// This page is only meant for development
// It is the source of /assets/images/banner.png

import { notFound } from "next/navigation";
import { Boxes } from "@/components/ui/background-boxes";
import VoctalIcon from "@/icons/brands/VoctalIcon";

export default () => {
    if (process.env.NODE_ENV === "production") {
        notFound();
    }

    return (
        <div className="h-screen w-screen bg-black">
            <div className="relative aspect-video w-[1050px] overflow-hidden bg-zinc-950 bg-linear-to-br/oklab from-blue-800/30 via-zinc-950 via-40% to-zinc-950">
                <div className="pointer-events-none absolute inset-0 z-20 h-full w-full [mask-image:radial-gradient(transparent,white)]" />
                <Boxes className="opacity-50" />
                <div className="relative z-20 flex h-full flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <VoctalIcon className="size-12" />
                        <span className="font-mono text-xl">Voctal</span>
                    </div>
                    <span className="cascadia-code text-[6rem] font-medium tracking-tight text-zinc-100">
                        Code Playground
                    </span>
                    <span className="mx-auto mb-8 max-w-2xl text-center font-mono text-3xl leading-13 text-zinc-400">
                        Quickly test code snippets in your browser, whenever you need.
                    </span>
                </div>
            </div>
        </div>
    );
};
