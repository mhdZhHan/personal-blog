import { defineAction, z } from "astro:actions"
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth"

import { auth } from "@firebase/config"

import { generateRandomGradient } from "@lib/randomGradient"

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
		/**
		 * firebase function create an account
		 * using email and password
		 * pass `email1` & `password` to `createUserWithEmailAndPassword` function create
		 * new account
		 */

		const user = await createUserWithEmailAndPassword(auth, email, password)

		// update the user with display name
		await updateProfile(user.user, {
			displayName: fullName,
			photoURL: generateRandomGradient(),
		})

		// create user in astro db
		
	},
})

export const loginAccount = defineAction({
	accept: "form",
	input: z.object({
		email: z.string().email(),
		password: z.string(),
	}),

	handler: async ({ email, password }) => {
		await signInWithEmailAndPassword(auth, email, password)
	},
})

export const logoutAccount = defineAction({
	handler: async () => {
		await auth.signOut()
	},
})
