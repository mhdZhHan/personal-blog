import { defineMiddleware } from "astro:middleware"
import { getCurrentUser } from "@lib/getCurrentUser"

export const onRequest = defineMiddleware(async (context, next) => {
	const { request, url } = context
	const { pathname } = url

	let currentUser

	if (!currentUser && pathname === "/auth/user" && request.method === "GET") {
		// Retrieve the session cookie from request headers
		const cookies = request.headers.get("Cookie")
		const sessionCookie = cookies
			?.split("; ")
			.find((cookie) => cookie.startsWith("session="))
			?.split("=")[1]

		if (sessionCookie) {
			currentUser = await getCurrentUser(sessionCookie)

			if (currentUser) {
				context.locals.user = {
					email: currentUser.email,
					fullName: currentUser.displayName,
					photoURL: currentUser.photoURL,
				}
			}
		} else {
			return context.redirect("/auth/login")
		}
	}

	if (
		(currentUser && pathname === "/auth/login") ||
		pathname === "/auth/signup"
	) {
		return context.redirect("/")
	}

	return next()
})
