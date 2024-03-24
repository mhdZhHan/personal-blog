export const prerender = false

import type { APIRoute } from "astro"
import { db, Like, eq, sql } from "astro:db"

export const POST: APIRoute = async ({ params, request }) => {
	const id = params.id

	if (!id) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		})
	}

	await db
		.update(Like)
		.set({ likes: sql`${Like.likes} + 1` })
		.where(eq(Like.id, id))

	return new Response(JSON.stringify({}), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
