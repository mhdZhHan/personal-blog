import { z, defineCollection } from 'astro:content'

const blog = defineCollection({
    schema: z.object({
        title: z.string(),
        draft: z.boolean().default(false),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()),
    }),
})

export const collections = { blog }
