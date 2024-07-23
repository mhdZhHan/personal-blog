/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		user: {
			fullName: string | null
			email: string | null
			photoURL: string | null
		}
	}
}

interface ImportMetaEnv {
	readonly API_KEY: string
	readonly AUTH_DOMAIN: string
	readonly PROJECT_ID: string
	readonly STORAGE_BUCKET: string
	readonly MESSAGING_SENDER_ID: string
	readonly APP_ID: string
	readonly MEASUREMENT_ID: string

	readonly FIREBASE_PROJECT_ID: string
	readonly FIREBASE_PRIVATE_KEY_ID: string
	readonly FIREBASE_PRIVATE_KEY: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
