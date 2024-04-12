const createStateContext = (initialUserData) => {
	let userData = initialUserData

	const setUserData = (newUserData) => {
		userData = newUserData
		localStorage.setItem("user", JSON.stringify(userData))
	}

	// Load initial user data from local storage
	const sessionUserData = JSON.parse(localStorage.getItem("user") as string)

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
			// logoutUser()
			localStorage.clear()
			break
		case "LOGIN":
			state.setUserData(action?.payload)
			break
		default:
			return
	}
}

export { updateUserData, state }
