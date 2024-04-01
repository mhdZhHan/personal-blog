import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import robotsTxt from "astro-robots-txt"
import vercel from "@astrojs/vercel/serverless"
import db from "@astrojs/db"

import { createCssVariablesTheme } from "shiki"
import rehypePrettyCode from "rehype-pretty-code"

// https://astro.build/config
export default defineConfig({
	site: "https://mohammedsh.xyz",

	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [
			[
				rehypePrettyCode,
				{ theme: createCssVariablesTheme({ name: "css-variables" }) },
			],
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
