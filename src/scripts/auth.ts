import { actions, isInputError } from "astro:actions"

const authForm = document.querySelector("#authForm") as HTMLFormElement

authForm?.addEventListener("submit", async (event) => {
	event.preventDefault()
	const formData = new FormData(authForm)
	const formType = formData.get("formType") as string

	if (formType === "Signup") {
		// passing the form data to createAccount action
		console.log("Hello")
		const { error, data } = await actions.createAccount.safe(formData)

		if (error) {
			// handle error (future)
			console.log(error)
			if (isInputError(error)) {
				console.log(error.fields)
			}
			return
		}

		console.log("Hello: ", data)

		// window.location.href = "/auth/user"
	} else if (formType === "Sign In") {
		// login
		const { error, data } = await actions.loginAccount.safe(formData)
		if (error) {
			// handle error (future)
			console.log(error)
			if (isInputError(error)) {
				console.log(error.fields)
			}
			return
		}

		console.log("Hello: ", data)
		// window.location.href = "/auth/user"
	}
})

export const AccountLogout = (logoutBtn: HTMLElement) => {
	logoutBtn?.addEventListener("click", async (event) => {
		const { error } = await actions.logoutAccount.safe()

		if (error) {
			// handle error (future)
			console.log(error)
			if (isInputError(error)) {
				console.log(error.fields)
			}
			return
		}

		window.location.href = "/"
	})
}
