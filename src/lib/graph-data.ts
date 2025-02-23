import type { CollectionEntry } from "astro:content";

type GraphNode = {
  id: string;
  text: string;
  tags: string[];
};

type GraphLink = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

/**
 * Extracts links from markdown content using regex
 * @param content Markdown content string
 * @returns Array of extracted links
 */
function extractLinksFromMarkdown(content: string): string[] {
  // Match both [text](link) and [[wiki-style]] links
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = markdownLinkRegex.exec(content)) !== null) {
    // If it's a markdown link, use the link part, otherwise use the wiki-style content
    const link = match[2] || match[3];
    if (link) {
      // Remove any anchor tags and clean the link
      const cleanLink = link.split("#")[0].trim();
      if (cleanLink && !cleanLink.startsWith("http")) {
        links.push(cleanLink);
      }
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

/**
 * Converts Astro blog posts to graph data format
 * @param posts Array of blog posts from Astro content collection
 * @returns Graph data object with nodes and links
 */
export function generateGraphData(posts: CollectionEntry<"blog">[]): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // First create all nodes
  posts.forEach((post) => {
    nodes.push({
      id: post.slug,
      text: post.data.title || post.slug,
      tags: post.data.tags || [],
    });

    // Create nodes for unique tags
    if (post.data.tags) {
      post.data.tags.forEach((tag) => {
        const tagId = `tag-${tag}`;
        if (!nodes.some((n) => n.id === tagId)) {
          nodes.push({
            id: tagId,
            text: `#${tag}`,
            tags: ["tag"],
          });
        }
        // Create links between posts and their tags
        links.push({
          source: post.slug,
          target: tagId,
        });
      });
    }
  });

  // Then create links between posts based on content references
  posts.forEach((post) => {
    const contentLinks = extractLinksFromMarkdown(post.body);

    contentLinks.forEach((link) => {
      // Find if the link corresponds to any existing post
      const targetPost = posts.find(
        (p) => p.slug === link || p.slug === `${link}/index`,
      );
      if (targetPost) {
        links.push({
          source: post.slug,
          target: targetPost.slug,
        });
      }
    });
  });

  return {
    nodes,
    links,
  };
}

/**
 * Converts graph data to hierarchical format with specified depth
 * @param data Original graph data
 * @param focusNode Central node to build hierarchy from
 * @param depth Maximum depth of connections to include (-1 for unlimited)
 * @returns Filtered graph data
 */
export function getGraphWithDepth(
  data: GraphData,
  focusNode: string,
  depth: number = 1,
): GraphData {
  if (depth === -1) return data;

  const includedNodes = new Set<string>([focusNode]);
  let frontier = new Set<string>([focusNode]);

  // BFS to find nodes within depth
  for (let i = 0; i < depth; i++) {
    const nextFrontier = new Set<string>();
    frontier.forEach((nodeId) => {
      data.links.forEach((link) => {
        if (link.source === nodeId) {
          includedNodes.add(link.target);
          nextFrontier.add(link.target);
        }
        if (link.target === nodeId) {
          includedNodes.add(link.source);
          nextFrontier.add(link.source);
        }
      });
    });
    frontier = nextFrontier;
  }

  return {
    nodes: data.nodes.filter((node) => includedNodes.has(node.id)),
    links: data.links.filter(
      (link) =>
        includedNodes.has(link.source) && includedNodes.has(link.target),
    ),
  };
}
