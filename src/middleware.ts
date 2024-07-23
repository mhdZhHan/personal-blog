import { defineMiddleware } from "astro:middleware"
import { auth as adminAuth } from "@firebase/server"

import type { UserProfile } from "./types/UserProfile.type"

export async function getCurrentUser(
	sessionCookie: string
): Promise<UserProfile | null> {
	try {
		// Verify the session cookie and get the decoded ID token
		const decodedIdToken = await adminAuth.verifySessionCookie(
			sessionCookie,
			true
		)

		// Get the user from the decoded ID token
		const userRecord = await adminAuth.getUser(decodedIdToken.uid)

		// Create a user profile object
		const userProfile: UserProfile = {
			displayName: userRecord.displayName ?? null,
			email: userRecord.email ?? null,
			photoURL: userRecord.photoURL ?? null,
		}
		return userProfile
	} catch (error) {
		return null
	}
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { request, url } = context
	const { pathname } = url

	// Retrieve the session cookie from request headers
	const cookies = request.headers.get("Cookie")
	const sessionCookie = cookies
		?.split("; ")
		.find((cookie) => cookie.startsWith("session="))
		?.split("=")[1]

	console.log(sessionCookie)

	if (!sessionCookie) {
		if (pathname === "/auth/user" && request.method === "GET") {
			return context.redirect("/auth/login")
		}
	} else {
		const currentUser = await getCurrentUser(sessionCookie)

		if (currentUser) {
			context.locals.user = {
				email: currentUser.email,
				fullName: currentUser.displayName,
				photoURL: currentUser.photoURL,
			}

			if (pathname === "/auth/login" || pathname === "/auth/signup") {
				return context.redirect("/")
			}
		} else {
			if (pathname === "/auth/user" && request.method === "GET") {
				return context.redirect("/auth/login")
			}
		}
	}

	return next()
})
