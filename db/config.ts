import { defineDb, defineTable, column } from "astro:db"

const Like = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		post: column.text({ unique: true }),
		likes: column.number({ default: 0 }),
	},
})

const PostView = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		post: column.text({ unique: true }),
		views: column.number({ default: 0 }),
	},
})

// https://astro.build/db/config
export default defineDb({
	tables: { Like, PostView },
})
