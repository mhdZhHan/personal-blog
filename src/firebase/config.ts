import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
	apiKey: import.meta.env.API_KEY,
	authDomain: import.meta.env.AUTH_DOMAIN,
	projectId: import.meta.env.PROJECT_ID,
	storageBucket: import.meta.env.API_KEY,
	messagingSenderId: import.meta.env.STORAGE_BUCKET,
	appId: import.meta.env.APP_ID,
	measurementId: import.meta.env.MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const auth = getAuth(app)
