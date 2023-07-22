import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createMdxFile = (fileName) => {
    const projectRoot = path.join(__dirname, '..');
    const postsDir = path.join(projectRoot, "src", "pages", "blogs")
    const currentDate = new Date().toISOString().slice(0, 10)
    const filePath = path.join(postsDir, `${currentDate}-${fileName}.mdx`)

    const title = fileName.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())

    // default mdx content 
    const markdownContent = `---
layout: "../../layouts/BlogPostLayout.astro"
title: ${title}
draft: false
pubDate: ${currentDate}
description: "description..."
author: "Mohammed"
image: "/images/blogs/"
tags: []
---

# ${title}

Post content here...
`

    fs.writeFile(filePath, markdownContent, (err) => {
        if (err) {
            console.error("Error creating post file:", err);
        } else {
            console.log(`Post '${filePath}' created successfully!`)
        }
    })
}

const [, , fileName] = process.argv;
if (!fileName) {
    console.error("Please provide a valid filename.")
} else {
    createMdxFile(fileName)
}
