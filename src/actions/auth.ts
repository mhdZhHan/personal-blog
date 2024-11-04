import { defineAction } from "astro:actions"
import { z } from "astro:schema"

import { auth as adminAuth } from "@firebase/server"
import { auth as clientAuth } from "@firebase/client"
import { signInWithEmailAndPassword } from "firebase/auth"

// import { generateRandomGradient } from "@lib/randomGradient"

export const createAccount = defineAction({
	accept: "form",
	input: z.object({
		email: z.string().email(),
		fullName: z.string(),
		password: z.string(),
	}),
	handler: async ({
		email,
		password,
		fullName,
	}: {
		email: string
		fullName: string
		password: string
	}) => {
		try {
			await adminAuth.createUser({
				email,
				password,
				displayName: fullName,
				// photoURL: generateRandomGradient(),
			})
		} catch (error) {
			return {
				status: false,
				message: error?.message,
			}
		}

		return {
			status: true,
			message: "User created successfully",
		}
	},
})

export const loginAccount = defineAction({
	accept: "form",
	input: z.object({
		email: z.string().email(),
		password: z.string(),
	}),

	handler: async ({ email, password }, context) => {
		try {
			const user = await adminAuth.getUserByEmail(email)

			if (!user) {
				return { status: 401, message: "User not found" }
			}

			const userCredential = await signInWithEmailAndPassword(
				clientAuth,
				email,
				password
			)

			const idToken = await userCredential.user.getIdToken()

			const fiveDays = 60 * 60 * 24 * 5 * 1000
			const sessionCookie = await adminAuth.createSessionCookie(idToken, {
				expiresIn: fiveDays,
			})

			/**
			 * Set a cookie named "session" with the session cookie value,
			 * which will be used to maintain the user's login session.
			 * The cookie is accessible across the entire site (path: "/").
			 */

			context.cookies.set("session", sessionCookie, {
				path: "/",
			})

			return { status: true, message: "Login successful" }
		} catch (error) {
			return { status: 401, message: error?.message }
		}
	},
})

export const logoutAccount = defineAction({
	handler: (_, context) => {
		context.cookies.delete("session", { path: "/" })
		return { status: true, message: "Logout successful" }
	},
})
