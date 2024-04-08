import { PASSWORD_REGEX, EMAIL_REGEX } from "../utils"

import { authWithGithub } from "../config/firebase"

const signupForm = document.getElementById("idSignupForm") || null
const loginForm = document.getElementById("idLoginForm") || null
const githubAuth = document.querySelector("#githubAuth") || null

async function handleSignup(event) {
	event.preventDefault()

	const form = new FormData(signupForm)

	const formData = {}

	for (const [key, value] of form.entries()) {
		formData[key] = value
	}

	const { fullName, email, password } = formData

	// validation
	if (!fullName) {
		console.log("Enter your full name")
	} else if (fullName && fullName.length < 3) {
		console.log("Full name must be at least 3 letter long")
	} else if (!email) {
		console.log("Enter email")
	} else if (email && !EMAIL_REGEX.test(email)) {
		console.log("Email is invalid")
	} else if (!PASSWORD_REGEX.test(password)) {
		console.log(
			"Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters"
		)
	} else {
		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				console.log("User created successfully")
				// TODO Redirect
			} else if (response.status === 409) {
				console.log("Email already exists")
			} else {
				console.log("Failed to create user")
			}
		} catch (error) {
			console.error("Error creating user:", error)
		}
	}
}

function handleLogin(event) {
	event.preventDefault()

	const form = new FormData(loginForm)

	const formData = {}

	for (const [key, value] of form.entries()) {
		formData[key] = value
	}

	const { email, password } = formData

	// validation
	if (!email) {
		console.log("Enter email")
	} else if (email && !EMAIL_REGEX.test(email)) {
		console.log("Email is invalid")
	} else if (!PASSWORD_REGEX.test(password)) {
		console.log(
			"Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters"
		)
	} else {
		fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
			.then((response) => {
				if (response.ok) {
					console.log("Login successful")
					// TODO redirect
				} else if (response.status === 404) {
					console.log("No user found with this email")
				} else if (response.status === 401) {
					console.log("Password is incorrect")
				} else {
					console.error("Login failed:", response.statusText)
				}
			})
			.catch((error) => {
				console.error("Login error:", error)
			})
	}
}

function handleGithubAuth(event) {
	event.preventDefault()

	authWithGithub()
		.then((user) => {
			const formData = {
				access_token: user?.accessToken,
			}

			fetch("/api/auth/github", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					if (response.ok) {
						console.log("Login successful")
						// TODO redirect
					}
				})
				.catch((error) => {
					console.error("Login error:", error)
				})
		})
		.catch((error) => {
			toast.error("trouble login through github")
			console.log(error)
		})
}

signupForm && signupForm.addEventListener("submit", handleSignup)

loginForm && loginForm.addEventListener("submit", handleLogin)

githubAuth && githubAuth.addEventListener("click", handleGithubAuth)
