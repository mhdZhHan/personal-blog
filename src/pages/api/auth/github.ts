export const prerender = false

import type { APIRoute } from "astro"
import { User, db, eq } from "astro:db"
import { getAuth } from "firebase-admin/auth"
import { app } from "@firebase/server.ts"
import { userData } from "@lib/getUserData"

export const POST: APIRoute = async ({ request }) => {
	try {
		if (request.headers.get("Content-Type") === "application/json") {
			const body = await request.json()
			const { access_token } = body

			return getAuth(app)
				.verifyIdToken(access_token)
				.then(async (decodedUser) => {
					const { email, name } = decodedUser

					const existingUser = await db
						.select()
						.from(User)
						.where(eq(User.email, email as string))

					if (existingUser[0]) {
						if (!existingUser[0].githubAuth) {
							return new Response(
								JSON.stringify({
									message:
										"This email was signed up without github. Please log in with password to access account",
									status: 403,
								}),
								{ status: 403 }
							)
						}
					} else {
						const newUser = await db.insert(User).values({
							fullName: name as string,
							email: email as string,
							githubAuth: true,
						})

						return new Response(
							JSON.stringify({
								message: "User signed up successfully",
								status: 200,
								user: userData(newUser),
							}),
							{ status: 200 }
						)
					}

					return new Response(
						JSON.stringify({
							message: "User logged in successfully",
							status: 200,
							user: userData(existingUser[0]),
						}),
						{ status: 200 }
					)
				})
				.catch((error) => {
					console.log(error)
					return new Response(
						JSON.stringify({
							message: "Internal Server Error",
							status: 500,
						}),
						{ status: 500 }
					)
				})
		} else {
			// If the Content-Type header is not application/json
			return new Response(null, { status: 400 })
		}
	} catch (error) {
		console.error("Error creating user:", error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
