import { readFile } from "node:fs/promises";
import { notFound } from "next/navigation";
import Playground from "@/components/playground/Playground";
import { getSnippetFiles, SNIPPETS_DIRECTORY } from "@/snippets/fs";
import { snippetSchema } from "@/snippets/schema";

export default async ({ params }: PageProps<"/share/[id]">) => {
    const id = (await params).id;

    let files;
    try {
        files = await getSnippetFiles();
    } catch (err) {
        console.error(err);
        // TODO: show error instead
        notFound();
    }

    const filename = `${id}.json`;
    if (!files.includes(filename)) {
        notFound();
    }

    let snippet;
    try {
        const file = (await readFile(`${SNIPPETS_DIRECTORY}/${filename}`)).toString();
        const json = JSON.parse(file);
        snippet = snippetSchema.parse(json);
    } catch (err) {
        console.error(err);
        // TODO: show error instead
        notFound();
    }

    return <Playground snippet={snippet} />;
};
