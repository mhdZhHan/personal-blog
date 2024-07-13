export function getLanguageIcon(language?: string): string {
	const icons: Record<string, string> = {
		js: "/lang/js.svg",
		ts: "/lang/ts.svg",
		jsx: "/lang/jsx.svg",
		tsx: "/lang/tsx.svg",
		python: "/lang/py.svg",
		html: "/lang/html.svg",
		css: "/lang/cdd.svg",
		cpp: "/lang/cpp.svg",
		c: "/lang/c.svg",
	}

	if (!language) {
		return "/lang/file.svg"
	}

	return icons[language.toLowerCase()] || "/lang/file.svg"
}
