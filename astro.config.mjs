import { defineConfig } from 'astro/config'

import mdx from "@astrojs/mdx"
import remarkToc from 'remark-toc';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'slack-dark', wrap: true, langs: [] },
    remarkPlugins: [ [remarkToc, { heading: "contents"} ] ],
  })],
})