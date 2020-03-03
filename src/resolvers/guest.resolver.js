import {GuestModel} from './../models/guest.model'
import {destructureUser} from './user.resolvers'
import {secure} from './../middlewares/secure.mid'
import {modelFinderById} from './user.resolvers'
const GuestFindById = modelFinderById(GuestModel)
const Query = {
	//TODO protect routes
	getGuest: secure((parent, {id}, context) => GuestFindById(id)),
	getGuests: secure((root, {limit, offset}) =>
		GuestModel.find({}).limit(limit).skip(offset)),
	getMyGuests: secure((root, {limit, offset}, context) =>
		GuestModel.find({
			owner: context.req.user.id
		}).limit(limit).skip(offset)),
}
//TODO protect routes
const Mutation = {
	createGuest : secure(async (root, {input}, context) => {
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
			isProtected: input.isProtected
		})
		newGuest.id = newGuest._id
		return new Promise (( resolve, reject ) => {
			return newGuest.save(err => {
				if(err) reject(err)
				else resolve(newGuest)
			})
		})
	}),
	sendGuest : secure(async (root, {email, status}, context) => {
		const {id} = context.req.user
		const guest = await GuestModel.findOne({email})
		if (!guest) throw new Error (`Guest ${email} doesn´t exist, please, create it first`)
		// console.log(guest.owner, id, guest.owner != id)
		return new Promise (( resolve, reject ) => {
			return guest.isProtected && guest.owner != id
				? reject(`${email} is isProtected, and is not your user. `)
				: resolve(sendMailAndUpdateStatus(guest))
		})
	}),
	signupGuest : async (root, {input, key}, context) => {
		console.log('📩 ', input.email)
		const guest = await GuestModel.findOne({email:input.email})
		//? can I extract this?
		if (!guest) throw new Error (`Sorry ${input.email} is not in our list`)
		if( guest.id !== key) throw new Error (`Sorry, this access is restricted by url. Please access with the email link`)
		if(guest.status !== 'SEND') throw new Error (`Hey, what r u doing here?. This accound is not ready yet`)
	 	guest.status = 'ACCEPTED' //should I remove the collection?. 
		const newUser = new context.User(destructureUser({...input, ...guest}))
		//? from here, we can call the save user in the user.resolver
		const userSaved = await newUser.save(guest.save());
		if(!userSaved) throw new Error ('💽 there was a problem saving the user')
		console.log('User Created 📬 📪 📭', userSaved)
		await context.login(userSaved);
		return {user: newUser}
	},
	updateGuestStatus : secure(async (root, {status, email}, context) => {
		const guest = await GuestModel.findOne({email})
		if(!guest) throw new Error (`Guest not found`)
		guest.status = status
		await guest.save()
		return guest
	})
}

export default {Query, Mutation}

const sendMailAndUpdateStatus = doc => {
	//* send mail with the doc.id as a key. 
	doc.status = 'SEND'
	console.log('sendMailAndUpdateStatus 📮')
	return new Promise ((resolve, reject) => {
		return doc.save(err => {
			if(err) reject(err)
			else resolve(doc)
		})
	})
}