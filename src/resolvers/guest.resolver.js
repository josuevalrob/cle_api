import {Guest} from './../models/guest.model'

const Query = {
	//TODO protect routes
	getGuest: (parent, {id}, context) => {
		return new Promise ((resolve, rejects) =>
			Guest.findById(
				id,
				(error, User) => {
					// console.log(`👤 ${id}`)
					return error //callback
					? rejects(error)
					: resolve(User)
				}
			)
		)
	},
	// getGuests
}
//TODO protect routes

const Mutation = {
	createGuest : async (root, {input}, context) => {
		console.log('preparint to save 💽...', input.email)
		const existUser = await context.User.findOne({email:input.email})
		if (existUser) throw new Error ('🙅🏻‍♂️ 📫 Email already registered as User')
		const newGuest = new Guest({
			firstName: input.firstName,
			email: input.email,
			letter: input.letter,
			status: input.status
		})
		newGuest.id = newGuest._id
		return new Promise (( resolve, reject ) => {
			return newGuest.save(err => {
					if(err) reject(err)
					else resolve(newGuest)
			})
		})
	},
}

export default {Query, Mutation}
