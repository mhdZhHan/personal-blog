import { simplifyDate } from "../utils"

const executeSearch = async (search, activeTags) => {
    const searchQuery = search.toLowerCase().trim()

    const response = await fetch(
        "/api/blog/search.json"
    )

    const searchData = await response.json()

    const filteredPosts = searchData.filter((post) => {
        const isVisible =
            (searchQuery === "" ||
                post.title.toLowerCase().includes(searchQuery) ||
                post.description.toLowerCase().includes(searchQuery)) &&
            (activeTags.length === 0 ||
                activeTags.some((tag) => post.tags.includes(tag)))

        return isVisible
    })

    if (searchQuery === "" && activeTags.length === 0) {
        return []
    }

    return filteredPosts
}

const searchFilter = document.querySelector("[data-post-filter-search]")
const tagsFilter = document.querySelector("[data-post-filter-tags]")
const staticPosts = document.querySelector("[data-static-posts]")
const searchedPosts = document.querySelector("[data-searched-posts]")
// const noPostsFound = document.querySelector("[data-no-posts-found]")

const activeTags = []

searchFilter.oninput = () => requestSearch()

tagsFilter.querySelectorAll("input").forEach((tag) => {
    tag.onchange = () => {
        if (tag.checked) {
            activeTags.push(tag.value)
        } else {
            const index = activeTags.indexOf(tag.value)

            if (index !== -1) {
                activeTags.splice(index, 1)
            }
        }

        requestSearch()
    }
})

async function requestSearch() {
    const payload = await executeSearch(
        searchFilter.value,
        Array.from(activeTags)
    )

    searchedPosts.innerHTML = ""

    if (payload.length) {
        staticPosts.classList.add("hidden")
        searchedPosts.classList.remove("hidden")
        // noPostsFound.classList.add("hidden")
    } else {
        staticPosts.classList.remove("hidden")
        searchedPosts.classList.add("hidden")
        // noPostsFound.classList.remove("hidden")
    }

    payload.forEach((post) => {
        const { image, title, description, pubDate, readingTime } = post

        searchedPosts.innerHTML += `
        <li class="post-card">
            <a href="${post.slug}" aria-label="${title}. ${description}">
                ${
                    image &&
                    image !== "" &&
                    `
                    <div class="post-card__thumbnail-container">
                        <img src="${image}" alt="${title}" />
                    </div>
                `
                }

                <div class="post-card__body">
                    <h2 class="title">${title}</h2>

                    <p class="body-text">${description}</p>

                    <div class="white-space"></div>

                    <div class="meta">
                        <div class="date">
                            <Calendar class="shrink-0" size="{14}" aria-hidden />
                            <time datetime="${pubDate}">${simplifyDate(pubDate).simplifiedDate}</time>
                        </div>

                        <div class="read">
                            <Clock4 class="shrink-0" size="{14}" aria-hidden />
                            <span>${readingTime} Min Read</span>
                        </div>
                    </div>
                </div>
            </a>
        </li>
    `
    })
}