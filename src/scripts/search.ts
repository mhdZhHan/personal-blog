import { executeSearch, prepareSearch } from "../utils/pagefind"

await prepareSearch()

const activeTopics = new Set<string>()
const searchFilter = document.querySelector(
	"[data-post-filter-search]"
) as HTMLInputElement
const topicsFilter = document.querySelector(
	"[data-post-filter-topics]"
) as HTMLUListElement
const staticPosts = document.querySelector(
	"[data-static-posts]"
) as HTMLUListElement
const searchedPosts = document.querySelector(
	"[data-searched-posts]"
) as HTMLUListElement
const noPostsFound = document.querySelector(
	"[data-no-posts-found]"
) as HTMLDivElement

if (
	!searchFilter ||
	!topicsFilter ||
	!staticPosts ||
	!searchedPosts ||
	!noPostsFound
)
  

searchFilter.oninput = async () => requestSearch()
topicsFilter.querySelectorAll("input").forEach((topic) => {
	topic.onchange = async () => {
		topic.checked
			? activeTopics.add(topic.value)
			: activeTopics.delete(topic.value)
		await requestSearch()
	}
})

const requestSearch = async () => {
	const payload = await executeSearch(
		searchFilter.value,
		Array.from(activeTopics)
	)
	searchedPosts.innerHTML = ""

	if (payload.length) {
		staticPosts.classList.add("hidden")
		searchedPosts.classList.remove("hidden")
		noPostsFound.classList.add("hidden")
	} else {
		searchedPosts.classList.add("hidden")
		if (searchFilter.value.length || activeTopics.size)
			noPostsFound.classList.remove("hidden")
		else staticPosts.classList.remove("hidden")
	}

	payload.forEach(({ raw_url, meta }) => {
		const post = encodeURIComponent(
			JSON.stringify({ ...meta, url: raw_url })
		)
    
		searchedPosts.innerHTML += `<li><post-line data-post="${post}"/></li>`
	})
}
