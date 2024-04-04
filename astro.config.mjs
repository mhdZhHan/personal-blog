import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import robotsTxt from "astro-robots-txt"
import vercel from "@astrojs/vercel/serverless"
import db from "@astrojs/db"

import rehypePrettyCode from "rehype-pretty-code"
import { toString } from "mdast-util-to-string"
import readingTime from "reading-time"
import { visit } from "unist-util-visit"

// https://astro.build/config
export default defineConfig({
	site: "https://mohammedsh.xyz",

	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [
			[
				rehypePrettyCode,
				{
					theme: "red",
					keepBackground: false,
				},
			],

			() => (tree, vfile) => {
				const data = vfile.data
				const payload = Math.round(readingTime(toString(tree)).minutes)
				data.astro.frontmatter.readingTime = payload

				visit(tree, "element", (node) => {
					if (
						node.properties?.["data-rehype-pretty-code-title"] !==
						""
					)
						return
					node.tagName = "div"
					node.properties.slot = "title"
				})
			},
		],
	},

	integrations: [
		mdx(),
		sitemap({ changefreq: "daily", lastmod: new Date() }),
		robotsTxt({
			host: true,
			policy: [{ userAgent: "*", disallow: ["/404"] }],
		}),
		,
		db(),
	],

	output: "hybrid",
	adapter: vercel({ webAnalytics: { enabled: true } }),
})
