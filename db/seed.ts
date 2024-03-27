import { db, Like } from "astro:db"

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Like).values([
		{ id: "2023-07-22-linux-for-beginners", likes: 0 },
		{
			id: "2023-07-22-overcoming-project-roadblocks-for-college-students",
			likes: 0,
		},
		{
			id: "2023-07-21-every-important-http-status-code-explained",
			likes: 0,
		},
		{ id: "2023-07-19-hello-world", likes: 0 },
		{ id: "2024-03-27-the-with-statement-in-python", likes: 0 },
	])
}
