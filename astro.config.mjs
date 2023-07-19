import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
// import markdownConfig from "./markdown.config"

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx({
            // ...markdownConfig,
            syntaxHighlight: "shiki",
            shikiConfig: { theme: "slack-dark", wrap: true, langs: [] },
        }),
    ],
})
