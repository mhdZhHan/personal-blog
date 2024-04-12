function setCookie(name: string, value: string, days?: number): void {
	let expires = ""
	if (days) {
		let date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

function getCookie(name: string): string | null {
	let nameEQ = name + "="
	let cookies = document.cookie.split(";")
	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i].trim()
		if (cookie.indexOf(nameEQ) === 0) {
			return cookie.substring(nameEQ.length, cookie.length)
		}
	}
	return null
}

function removeCookie(name: string): void {
	// Set the expiration date to a past time to remove the cookie
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

export { setCookie, getCookie, removeCookie }
