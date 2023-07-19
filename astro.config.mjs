import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
// import markdownConfig from "./markdown.config"

export default defineConfig({
    integrations: [
        mdx({
            syntaxHighlight: "shiki",
            shikiConfig: { theme: "slack-dark", wrap: true, langs: [] },
        }),
    ],
})
