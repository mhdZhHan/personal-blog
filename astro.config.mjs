import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// import markdownConfig from "./markdown.config"
import tokyoNight from "./tokyo-night.json";

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx({
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: tokyoNight,
      wrap: true,
      langs: []
    }
  }), react(), image()]
});