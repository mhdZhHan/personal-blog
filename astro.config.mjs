import { defineConfig } from 'astro/config'

import mdx from "@astrojs/mdx"
import remarkToc from 'remark-toc';
import vercelEdge from '@astrojs/vercel/edge'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'slack-dark', wrap: true, langs: [] },
    remarkPlugins: [ [remarkToc, { heading: "contents"} ] ],
  })],
  output: 'server',
  adapter: vercelEdge(),
})