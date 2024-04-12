import jwt from "jsonwebtoken"

export const userData = (user) => {
	const access_token = jwt.sign({ id: user }, "hello_world")

	return {
		access_token,
		fullName: user?.fullName,
	}
}
