import { getCollection } from "astro:content"
import { sortByDate, nonDraftPosts } from '../utils'

async function getPosts() {
    const posts = (await getCollection("blog"))
    const nonDraftPosts_ = nonDraftPosts(posts)
    const sortedPosts = sortByDate(nonDraftPosts_)

    return sortedPosts.map((post) => ({
        slug: post.slug,
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
    }))
}

export async function get({}) {
    return new Response(JSON.stringify(await getPosts()), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}