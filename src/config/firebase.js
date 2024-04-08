import { initializeApp } from "firebase/app"
import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
	apiKey: "AIzaSyAkxj7WrumYIu3RmYbt9YVKEnIpiPLi0s8",
	authDomain: "personal-blog-b662c.firebaseapp.com",
	projectId: "personal-blog-b662c",
	storageBucket: "personal-blog-b662c.appspot.com",
	messagingSenderId: "675210074998",
	appId: "1:675210074998:web:d80c5ad0410c61a7303857",
	measurementId: "G-NL2RP3YX1L",
}

const app = initializeApp(firebaseConfig)

const auth = getAuth()

const provider = new GithubAuthProvider()

export const authWithGithub = async () => {
	let user = null

	await signInWithPopup(auth, provider)
		.then((response) => {
			user = response?.user
		})
		.catch((error) => {
			console.log(error)
		})

	return user
}
