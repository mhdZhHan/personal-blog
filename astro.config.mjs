import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

// plugins
import mdx from "@astrojs/mdx";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";

// markdown plugins
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// utils
import readingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

import tailwindcss from "@tailwindcss/vite";

const prettyCodeOptions = {
  theme: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
  keepBackground: false,
  defaultLang: "plaintext",
  filters: [],
};

const autolinkHeadingsOptions = {
  behavior: "prepend",
  content: {
    type: "text",
    value: "#",
  },
  headingProperties: {
    className: ["anchor"],
  },
  properties: {
    className: ["anchor-link"],
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://mohammedsh.xyz",
  trailingSlash: "never",
  output: "static",
  adapter: vercel({
    webAnalytics: { enabled: true },
    isr: {
      expiration: 60 * 60 * 24,
    },
    imageService: true,
    devImageService: "sharp",
  }),

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [rehypeAutolinkHeadings, autolinkHeadingsOptions],

      () => (tree, vfile) => {
        const data = vfile.data;
        const payload = Math.round(readingTime(toString(tree)).minutes);
        data.astro.frontmatter.readingTime = payload;

        visit(tree, "element", (node) => {
          if (node.properties?.["data-rehype-pretty-code-title"] !== "") return;
          node.tagName = "div";
          node.properties.slot = "title";
        });
      },
    ],
  },

  integrations: [
    mdx(),
    sitemap({ changefreq: "daily", lastmod: new Date() }),
    robotsTxt({
      policy: [{ userAgent: "*", disallow: ["/404"] }],
    }),
    db(),
    react(),
  ],

  // experimental: {
  // 	actions: true,
  // },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },

    plugins: [tailwindcss()],
  },
});
