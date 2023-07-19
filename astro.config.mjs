import { defineConfig } from 'astro/config'

import mdx from "@astrojs/mdx"
import vercelEdge from '@astrojs/vercel/edge'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'nord' },
  })],
  output: 'server',
  adapter: vercelEdge(),
})