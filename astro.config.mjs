import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import robotsTxt from "astro-robots-txt"
import vercel from "@astrojs/vercel/serverless"
import db from "@astrojs/db"

import syntaxTheme from "./syntax-theme.json"

// https://astro.build/config
export default defineConfig({
	site: "https://mohammedsh.xyz",
	integrations: [
		mdx({
			shikiConfig: {
				theme: syntaxTheme,
			},
		}),
		sitemap(),
		robotsTxt(),
		db(),
	],
	output: "hybrid",
	adapter: vercel(),
})
