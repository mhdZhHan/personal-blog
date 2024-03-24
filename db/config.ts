import { defineDb, defineTable, column } from "astro:db"

const Like = defineTable({
	columns: {
		id: column.text(),
		likes: column.number(),
	},
})

// https://astro.build/db/config
export default defineDb({
	tables: { Like },
})
