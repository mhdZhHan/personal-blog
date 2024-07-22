export const prerender = false

import { auth } from "@firebase/config"
import { defineMiddleware } from "astro:middleware"
import { onAuthStateChanged } from "firebase/auth"

import type { UserProfile } from "./types/UserProfile.type"

const getCurrentUser = (): Promise<UserProfile | null> => {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(
			auth,
			(user) => {
				if (user) {
					const userProfile: UserProfile = {
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
					}
					resolve(userProfile)
				} else {
					resolve(null)
				}
			},
			reject
		)
	})
}

export const onRequest = defineMiddleware(async (context, next) => {
	const currentUser = await getCurrentUser()

	console.log("Hello", currentUser)

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
			email: currentUser?.email,
			fullName: currentUser?.displayName,
			photoURL: currentUser?.photoURL,
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
