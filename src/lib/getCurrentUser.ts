import { auth as adminAuth } from "@firebase/server"

import type { UserProfile } from "../types/UserProfile.type"

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
