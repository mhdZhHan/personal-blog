const storageKey = "theme-preference"

const darkModeToggle = document.querySelector("#toggle_theme")

const getColorPreference = () => {
	let preference = localStorage.getItem(storageKey)

	if (!preference) {
		preference = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "cool"
	}

	return preference
}

const setPreference = (themeName) => {
	localStorage.setItem(storageKey, themeName)

	document.firstElementChild.setAttribute("data-theme", themeName)
}

const togglePreference = () => {
	setPreference(getColorPreference() === "dark" ? "cool" : "dark")
}

;(() => {
	const theme = getColorPreference()

	setPreference(theme)
})()

darkModeToggle.addEventListener("click", togglePreference)
