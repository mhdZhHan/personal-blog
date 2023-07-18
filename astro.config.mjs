import { defineConfig } from 'astro/config';
import vercelEdge from '@astrojs/vercel/edge';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  output: 'server',
  adapter: vercelEdge(),
});