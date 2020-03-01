import {GuestModel} from './../models/guest.model'

const Query = {
	//TODO protect routes
	getGuest: (parent, {id}, context) => {
		return new Promise ((resolve, rejects) =>
			GuestModel.findById(
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
	// getGuests:()
	// getMyGuests:()
}
//TODO protect routes
const Mutation = {
	createGuest : async (root, {input}, context) => {
		const {id, firstName} = context.req.user
		console.log('preparint to save 💽...', input.email + ' by ' + firstName)
		const existUser = await context.User.findOne({email:input.email})
		if (existUser) throw new Error ('🙅🏻‍♂️ 📫 Email already registered as User')
		const newGuest = new GuestModel({
			firstName: input.firstName,
			email: input.email,
			rol: input.rol,
			letter: input.letter,
			status: input.status,
			owner: id,
			protected: input.protected
		})
		newGuest.id = newGuest._id
		return new Promise (( resolve, reject ) => {
			return newGuest.save(err => {
				if(err) reject(err)
				else resolve(newGuest)
			})
		})
	},
	sendGuest : async (root, {email, status}, context) => {
		const {id} = context.req.user
		const guest = await GuestModel.findOne({email})
		if (guest) throw new Error (`Guest ${email} doesn´t exist, please, create it first`)
		console.log(guest.protected, guest.owner, id)
		return new Promise (( resolve, reject ) => {
			return guest.protected && guest.owner !== id
				? reject(`${email} is protected, and is not your user. `)
				: resolve(sendMailAndUpdateStatus(guest))
		})
	}
}

export default {Query, Mutation}

const sendMailAndUpdateStatus = doc => {
	//* send mail
	doc.status = 'SEND'
	console.log('sendMailAndUpdateStatus 📮')
	return new Promise ((resolve, reject) => {
		return doc.save(err => {
			if(err) reject(err)
			else resolve(doc)
		})
	})
}