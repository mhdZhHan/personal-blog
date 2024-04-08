import { PASSWORD_REGEX, EMAIL_REGEX } from "../utils"

const signupForm = document.getElementById("idSignupForm") || null
const loginForm = document.getElementById("idLoginForm") || null

async function handleSignup(event) {
	event.preventDefault()

	const form = new FormData(signupForm)

	const formData = {}

	for (const [key, value] of form.entries()) {
		formData[key] = value
	}

	const { fullName, email, password } = formData

	// validation
	if (!fullName || fullName.length < 3) {
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
				// Redirect the user to the login page or any other appropriate page
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

	const { fullName, email, password } = formData

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
		console.log("Form Data:", formData)
	}
}

signupForm && signupForm.addEventListener("submit", handleSignup)

loginForm && loginForm.addEventListener("submit", handleLogin)
