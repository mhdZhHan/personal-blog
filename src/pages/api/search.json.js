import { getCollection } from "astro:content"
import { nonDraftPosts } from "../../utils"

async function getPosts() {
	const blogs = (await getCollection("blog")).sort(
		(a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
	)

	return nonDraftPosts(blogs).map((post) => ({
		slug: post.slug,
		title: post.data.title,
		description: post.data.description,
		image: post.data.image,
		tags: post.data.tags,
		author: post.data.author,
		pubDate: post.data.pubDate,
	}))
}

export async function GET({}) {
	return new Response(JSON.stringify(await getPosts()), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
