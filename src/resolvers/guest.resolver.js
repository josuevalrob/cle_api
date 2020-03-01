import {GuestModel} from './../models/guest.model'
import {ObjectId} from 'mongoose'
import {destructureUser} from './user.resolvers'
import {secure} from './../middlewares/secure.mid'
const Query = {
	//TODO protect routes
	getGuest: secure((parent, {id}, context) => {
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
	}),
	getGuests: secure((root, {limit, offset}) =>
		GuestModel.find({}).limit(limit).skip(offset)),
	getMyGuests: secure((root, {limit, offset}, context) =>
		GuestModel.find({
			owner: context.req.user.id
		}).limit(limit).skip(offset)),
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
	},
	signupGuest : async (root, {input}, context) => {
    console.log('📩 ', input.email)
    const guest = await GuestModel.findOne({email:input.email})
		if (!guest) throw new Error (`Sorry ${input.email} is not in our list`)
		const newUser = new context.User(destructureUser({...input, ...guest}))
		//? from here, we can call the save user in the user.resolver
    const userSaved = await newUser.save();
    if(!userSaved) throw new Error ('💽 there was a problem saving the user')
    console.log('User Created 📬 📪 📭', userSaved)
    await context.login(userSaved);
    // if(!isLogged) throw new Error ('Wops, there was a problem making the logging')
    return {user: newUser}
  },
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