export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

export const sortByDate = (posts) => {
    return posts.sort(
        (a, b) =>
            new Date(b.data.pubDate).valueOf() -
            new Date(a.data.pubDate).valueOf()
    )
}

export const nonDraftPosts = (posts) => {
    return posts.filter((post) => !post.data.draft)
}
