export const prerender = false

import type { APIRoute } from "astro"
import { db, Like, eq, sql } from "astro:db"

export const POST: APIRoute = async ({ params, request }) => {
	const post = params.post

	console.log(post)

	if (!post) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	const req = await db
		.update(Like)
		.set({ likes: sql`${Like.likes} + 1` })
		.where(eq(Like.post, post))
		.returning({ likes: Like.likes })

	console.log(req.rowsAffected)

	if (req.rowsAffected === 0) {
		await db.insert(Like).values({
			post,
			likes: 1,
		})
	}

	return new Response(JSON.stringify({}), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
