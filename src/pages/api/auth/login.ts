export const prerender = false

import type { APIRoute } from "astro"
import { User, db, eq } from "astro:db"
import bcrypt from "bcryptjs"

import { EMAIL_REGEX } from "@lib/index"
import { userData } from "@lib/getUserData"

export const POST: APIRoute = async ({ request }) => {
	try {
		if (request.headers.get("Content-Type") === "application/json") {
			const body = await request.json()
			const { email, password } = body

			if (!EMAIL_REGEX.test(email)) {
				return new Response("Email is invalid", { status: 400 })
			}

			const existingUser = await db
				.select()
				.from(User)
				.where(eq(User.email, email))

			if (!existingUser[0]) {
				return new Response("No user found with this email", {
					status: 404,
				})
			}

			// Compare hashed password
			const passwordMatch = await bcrypt.compare(
				password,
				existingUser[0].password as string
			)

			if (!passwordMatch) {
				return new Response("Password is incorrect", { status: 401 })
			}

			// Success response
			return new Response(
				JSON.stringify({
					status: 200,
					user: userData(existingUser[0]),
				}),
				{ status: 200 }
			)
		} else {
			// If the Content-Type header is not application/json
			return new Response(null, { status: 400 })
		}
	} catch (error) {
		console.error("Error logging in:", error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
