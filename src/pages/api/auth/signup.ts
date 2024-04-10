export const prerender = false

import type { APIRoute } from "astro"
import { User, db, eq } from "astro:db"

import bcrypt from "bcryptjs"

import { PASSWORD_REGEX, EMAIL_REGEX } from "../../../lib"

export const POST: APIRoute = async ({ request }) => {
	try {
		if (request.headers.get("Content-Type") === "application/json") {
			const body = await request.json()
			const { fullName, email, password } = body

			if (!fullName || fullName.length < 3) {
				return new Response(
					"Full name must be at least 3 letters long",
					{ status: 400 }
				)
			} else if (!email) {
				return new Response("Enter email", { status: 400 })
			} else if (!EMAIL_REGEX.test(email)) {
				return new Response("Email is invalid", { status: 400 })
			} else if (!PASSWORD_REGEX.test(password)) {
				return new Response(
					"Password should be 6 to 20 characters long with at least one numeric, one lowercase, and one uppercase letter",
					{ status: 400 }
				)
			}

			// Check if the email already exists
			const existingUser = await db
				.select()
				.from(User)
				.where(eq(User.email, email))

			if (existingUser.length) {
				return new Response("Email already exists", { status: 409 })
			}

			// hashing password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Insert new user
			const newUser = await db.insert(User).values({
				fullName,
				email,
				password: hashedPassword,
			})

			if (!newUser) {
				// If failed to insert the user
				return new Response("Failed to create user", { status: 500 })
			}

			// Return a success response
			return new Response(
				JSON.stringify({
					message: "User created successfully",
				}),
				{ status: 200 }
			)
		} else {
			// If the Content-Type header is not application/json
			return new Response(null, { status: 400 })
		}
	} catch (error) {
		console.error("Error creating user:", error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
