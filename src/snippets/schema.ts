import { z } from "zod/v4";

export const snippetSchema = z.object({
    id: z.string(),
    createdAt: z.number(),
    language: z.string(),
    content: z.string(),
});

export type Snippet = z.infer<typeof snippetSchema>;
