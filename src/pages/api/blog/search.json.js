import { getCollection } from "astro:content"
import readingTime from "reading-time"

import { nonDraftPosts, markdownToPlainText } from "../../../lib"

async function getPosts() {
	const blogs = (await getCollection("blog")).sort(
		(a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
	)

	const posts = nonDraftPosts(blogs).map((post) => {
		const content = markdownToPlainText(post.body)

		const { minutes } = readingTime(content)

		return {
			slug: post.slug,
			title: post.data.title,
			description: post.data.description,
			image: post.data.image,
			tags: post.data.tags,
			author: post.data.author,
			pubDate: post.data.pubDate,
			readingTime: Math.ceil(minutes),
		}
	})

	return posts
}

export async function GET({}) {
	return new Response(JSON.stringify(await getPosts()), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
