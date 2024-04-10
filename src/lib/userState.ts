import { getSession, setSession, logoutUser } from "./session"

const createStateContext = (initialUserData) => {
	let userData = initialUserData

	const setUserData = (newUserData) => {
		userData = newUserData
		setSession("user", JSON.stringify(userData))
	}

	// Load initial user data from session storage
	const sessionUserData = JSON.parse(getSession("user") as string)

	if (sessionUserData) {
		userData = sessionUserData
	}

	return {
		userData,
		setUserData,
	}
}

const state = createStateContext({ access_token: null })

// Functions to update user data
const updateUserData = (action) => {
	switch (action?.type) {
		case "LOGOUT":
			state.setUserData({ access_token: null })
			logoutUser()
			break
		case "LOGIN":
			state.setUserData(action?.payload)
			break
		default:
			return
	}
}

export { updateUserData, state }

// Example usage:
updateUserData({ type: "LOGIN", payload: { access_token: "some_token" } })
console.log(state.userData) // Output: { access_token: "some_token" }
updateUserData({ type: "LOGOUT" })
console.log(state.userData) // Output: { access_token: null }
