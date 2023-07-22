// import { getCollection } from "astro:content"
import { sortByDate, nonDraftPosts } from '../utils'

async function getPosts() {
    // const posts = (await getCollection("blogs"))
    // const nonDraftPosts_ = nonDraftPosts(posts)
    // const sortedPosts = sortByDate(nonDraftPosts_)

    return sortedPosts
}

export async function get({}) {
    return new Response(JSON.stringify(await getPosts()), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}