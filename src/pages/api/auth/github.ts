import type { APIRoute } from "astro"
import { User, db, eq } from "astro:db"

import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"

import serviceAccount from "../../../../personal-blog-firebase-key.json"

export const prerender = false

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})

export const POST: APIRoute = async ({ request }) => {
	try {
		if (request.headers.get("Content-Type") === "application/json") {
			const body = await request.json()

			const { access_token } = body

			getAuth()
				.verifyIdToken(access_token)
				.then(async (decodedUser) => {
					const { email, name } = decodedUser

					const existingUser = await db
						.select()
						.from(User)
						.where(eq(User.email, email))

					if (existingUser[0]) {
						// login
						if (!existingUser[0].githubAuth) {
							return new Response(
								"This email was signed up without github. please log in with password to access account",
								{
									status: 403,
								}
							)
						}
					} else {
						// User does not exist, sign up the user
						await db.insert(User).values({
							fullName: name,
							email,
							githubAuth: true,
						})

						return new Response(
							JSON.stringify({
								message: "User created successfully",
							}),
							{ status: 200 }
						)
					}
				})

			return new Response(
				JSON.stringify({
					message: "User logged in successfully",
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
