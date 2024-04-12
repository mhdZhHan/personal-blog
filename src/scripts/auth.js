import { PASSWORD_REGEX, EMAIL_REGEX } from "@lib/index.js"
import { updateUserData } from "@lib/userState.ts"

import { authWithGithub } from "@firebase/client.ts"

const signupForm = document.getElementById("idSignupForm") || null
const loginForm = document.getElementById("idLoginForm") || null
const githubAuth = document.querySelector("#githubAuth") || null
const popupModel = document.querySelector("#popupModel") || null

// function fro toasting
function toast(msg, route) {
	popupModel.textContent = msg

	popupModel.style.display = "block"

	setTimeout(function () {
		if (route) {
			window.location.href = route
		}
		popupModel.style.display = "none"
	}, 1000)
}

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
		toast("Enter your full name")
	} else if (fullName && fullName.length < 3) {
		toast("Full name must be at least 3 letter long")
	} else if (!email) {
		toast("Enter email")
	} else if (email && !EMAIL_REGEX.test(email)) {
		toast("Email is invalid")
	} else if (!PASSWORD_REGEX.test(password)) {
		toast(
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
				const { user } = await response.json()

				updateUserData({ type: "LOGIN", payload: user })

				toast("Account created 🚀", "/")
			} else if (response.status === 409) {
				toast("Email already exists")
			} else {
				toast("Failed to create user try again")
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
		toast("Enter email")
	} else if (email && !EMAIL_REGEX.test(email)) {
		toast("Email is invalid")
	} else if (!PASSWORD_REGEX.test(password)) {
		toast(
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
			.then(async (response) => {
				if (response.ok) {
					const { user } = await response.json()

					updateUserData({ type: "LOGIN", payload: user })

					toast("Login successfully 🚀", "/")
				} else if (response.status === 404) {
					toast("No user found with this email")
				} else if (response.status === 401) {
					toast("Password is incorrect")
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
				.then(async (response) => {
					if (response.ok) {
						const { user } = await response.json()

						updateUserData({ type: "LOGIN", payload: user })

						toast("Successfully logged in 🚀", "/")
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
