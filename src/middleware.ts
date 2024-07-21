import { auth } from "@firebase/config"
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware((context, next) => {
	const currentUser = auth.currentUser

	const { pathname } = context.url

	if (
		!currentUser &&
		pathname === "/auth/user" &&
		context.request.method === "GET"
	) {
		return context.redirect("/auth/login")
	}

	if (currentUser) {
		context.locals.user = {
			email: currentUser.email,
			fullName: currentUser.displayName,
			userProfile: currentUser.photoURL,
		}
	}

	if (
		currentUser &&
		(pathname === "/auth/login" || pathname === "/auth/signup")
	) {
		return context.redirect("/")
	}

	return next()
})
