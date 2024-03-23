import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import image from "@astrojs/image"

import sitemap from "@astrojs/sitemap"

export default defineConfig({
	site: "https://mohammedsh.xyz",
	integrations: [
		mdx({
			syntaxHighlight: false,
		}),
		image(),
		sitemap(),
	],
})
