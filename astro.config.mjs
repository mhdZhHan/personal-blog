import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import robotsTxt from "astro-robots-txt"

import rehypePrism from "rehype-prism-plus"
import rehypeCodeTitles from "rehype-code-titles"

export default defineConfig({
	site: "https://mohammedsh.xyz",
	integrations: [
		mdx({
			syntaxHighlight: false,
			rehypePlugins: [rehypeCodeTitles, rehypePrism],
		}),
		sitemap(),
		robotsTxt(),
	],
})
