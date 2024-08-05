import { z, defineCollection } from "astro:content"

const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		draft: z.boolean().default(false),
		pubDate: z.date(),
		description: z.string(),
		author: z.enum(["Mohammed"]),
		image: z.string().optional(),
		tags: z.array(z.string()),
	}),
})

const demosCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date(),
		updatedDate: z.date().optional(),
		image: z.string().optional(),
		category: z.enum(["App", "Web", "AI", "Desktop"]),
		tags: z.array(z.string()).optional(),
		liveDemo: z.string().url().optional(),
		sourceCode: z.string().url().optional(),
	}),
})

export const collections = { blog: blogCollection, demos: demosCollection }
