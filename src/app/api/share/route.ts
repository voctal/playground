import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { languageKeys } from "@/config/constants";
import { addSnippetFile, SNIPPETS_DIRECTORY } from "@/snippets/fs";
import type { snippetSchema } from "@/snippets/schema";

const shareSchema = z.object({
    language: z.enum(languageKeys as [string, ...string[]]),
    content: z.string().min(1).max(2000),
});

// TODO: find how to get the request IP and do a ratelimit by IP
const ratelimit: [timestamp: number, count: number] = [0, 0];
const RATELIMIT_INTERVAL = 3000;
const RATELIMIT_MAX_REQUESTS = 5;

export async function POST(request: NextRequest) {
    if (Date.now() - ratelimit[0] > RATELIMIT_INTERVAL) {
        ratelimit[0] = Date.now();
        ratelimit[1] = 0;
    }
    if (ratelimit[1] >= RATELIMIT_MAX_REQUESTS) {
        return new Response(null, { status: 429 });
    } else {
        ratelimit[1]++;
    }

    // Validation
    let data;
    try {
        const json = await request.json();
        data = shareSchema.parse(json);
    } catch {
        return new Response(null, { status: 400 });
    }

    const id = randomUUID();
    const filename = `${id}.json`;
    const share: z.infer<typeof snippetSchema> = {
        id,
        createdAt: Date.now(),
        language: data.language,
        content: data.content,
    };

    // Create the snippet
    try {
        if (!existsSync(SNIPPETS_DIRECTORY)) {
            await mkdir(SNIPPETS_DIRECTORY);
        }

        await writeFile(`${SNIPPETS_DIRECTORY}/${filename}`, JSON.stringify(share, null, 2));
    } catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }

    addSnippetFile(filename);

    return new Response(JSON.stringify({ id }), { status: 201 });
}
