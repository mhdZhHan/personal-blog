export const prerender = false

import type { APIRoute } from "astro"
import { User, db, eq } from "astro:db"

import type { ServiceAccount } from "firebase-admin"
import { initializeApp, cert, getApps } from "firebase-admin/app"

import { getAuth } from "firebase-admin/auth"

const activeApps = getApps()

const serviceAccount = {
	type: "service_account",
	project_id: import.meta.env.FIREBASE_PROJECT_ID,
	private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: import.meta.env.FIREBASE_PRIVATE_KEY,
	client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
	client_id: import.meta.env.FIREBASE_CLIENT_ID,
	auth_uri: import.meta.env.FIREBASE_AUTH_URI,
	token_uri: import.meta.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
	client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
	universe_domain: "googleapis.com",
}

export const app =
	activeApps.length === 0
		? initializeApp({
				credential: cert(serviceAccount as ServiceAccount),
		  })
		: activeApps[0]

export const POST: APIRoute = async ({ request }) => {
	try {
		if (request.headers.get("Content-Type") === "application/json") {
			const body = await request.json()

			const { access_token } = body

			getAuth()
				.verifyIdToken(access_token)
				.then(async (decodedUser) => {
					const { email, name, picture } = decodedUser

					const existingUser = await db
						.select()
						.from(User)
						.where(eq(User.email, email as string))

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
							fullName: name as string,
							email: email as string,
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
