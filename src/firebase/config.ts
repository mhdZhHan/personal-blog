import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
	apiKey: import.meta.env.API_KEY,
	authDomain: import.meta.env.AUTH_DOMAIN,
	projectId: import.meta.env.PROJECT_ID,
	storageBucket: import.meta.env.STORAGE_BUCKET,
	messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
	appId: import.meta.env.APP_ID,
	measurementId: import.meta.env.MEASUREMENT_ID,
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
