import { auth } from "@firebase/config"
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware((context, next) => {
	const currentUser = auth.currentUser

	if (currentUser) {
		context.locals.userEmail = currentUser.email
	}

	return next()
})
