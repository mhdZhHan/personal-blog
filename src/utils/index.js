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
            new Date(b.frontmatter.pubDate).valueOf() -
            new Date(a.frontmatter.pubDate).valueOf()
    )
}
