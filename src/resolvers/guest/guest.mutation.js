import {GuestModel} from './../../models/guest.model'
import CampingModel from './../../models/camping.model'
import sendMail from './../../helpers/mail.helper'
import {destructureUser} from './../users/user.mutations'
import {secure} from './../../middlewares/secure.mid'
import { newGuestRequest, guestApproved, assignManager } from "./../../templates";

const Mutation = {
	createGuest : async (root, {input}, context) => {
		console.log('preparint to save 💽...', input.email )
		const existUser = await context.User.findOne({email:input.email})
		const existGuest = await GuestModel.findOne({email:input.email})
		if (existUser || existGuest) throw new Error ('🙅🏻‍♂️ 📫 Email already in use')
		const newGuest = new GuestModel({
			...(!!context.req && !!context.req.user && { owner: context.req.user.id}),
			firstName: input.firstName,
			email: input.email,
			rol: input.rol,
			letter: input.letter,
			status: input.status,
			isProtected: input.isProtected
		})
		newGuest.id = newGuest._id
		return new Promise (( resolve, reject ) => {
			return newGuest.save(err => {
				if(err) reject(err)
				else resolve(sendMailToAdmin(newGuest))
			})
		})
	},
	sendGuest : secure(async (root, {id, letter}, context) => {
		const guest = await GuestModel.findById(id)
		if (!guest) throw new Error (`Guest ${email} doesn´t exist, please, create it first`)
		guest.letter = letter
		// console.log('Ready to send mail to 📮 ', guest.firstName)
		return new Promise (( resolve, reject ) => {
			return guest.isProtected && guest.owner != context.req.user.id
				? reject(`${email} is isProtected, and is not your user. `)
				: resolve(sendMailAndUpdateStatus(guest))
		})
	}),
	// TODO update guest status!!
	signupGuest : async (root, {input, key}, context) => { //final part of the guest process
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

		// * once the user is created we need to find and update all the turns relateds.
		console.log("let's update the related turn & campings 🏕")
		const res = await CampingModel.updateMany({patreonEmail:userSaved.email}, {"$set":{"patron": userSaved.id}})
		console.log(`${res.n} documentes matched and ${res.nModified} modified`)

		await context.login(userSaved);
		return {user: newUser}
	},
	updateGuestStatus : secure(async (root, {status, email}, context) => { //backdoor
		const guest = await GuestModel.findOne({email})
		if(!guest) throw new Error (`Guest not found`)
		guest.status = status
		await guest.save()
		return guest
	}),
	updateGuest : secure(async(_, {input}, context) => {
		const guest = await GuestModel.findById(input.id)
		if(!guest) throw new Error('Guest not found')
		Object.assign(guest, input);
		return new Promise (( resolve, reject ) =>
			guest.save(async err => {
				if(!!err) return reject(err)
				const guestAndOwner = await guest.populate('owner').execPopulate()
				if(input.owner == guest.owner._id) return resolve(guestAndOwner)
				// * if they are not the same, let's notify to the new owner/manager
				return resolve(notifyNewManager(guestAndOwner))
			})
		)
	}),
	deleteGuest : secure((root, {id}) => {
		console.log('💀 Killing guest',id)
		return new Promise ((resolve, object) =>
				GuestModel.findOneAndRemove(
					{_id : id} ,
					(error, guest) => error //callback
						? rejects(error)
						: resolve("Se elimino correctamente")
				)
		)
	}),
}

export default Mutation

const sendMailAndUpdateStatus = async doc => {
	const {accepted} = await sendMail(doc.email, guestApproved(doc)).catch(console.error)
	doc.status = accepted.includes(doc.email) ? 'SEND' : 'STANDBY'
	return new Promise ((resolve, reject) => {
		return doc.save(err => {
			if(err) reject(err)
			else resolve(doc)
		})
	})
}

const sendMailToAdmin = async doc => {
	await sendMail(
		process.env.FIRST_ADMIN_EMAIL, //* email goes to the general admin
		newGuestRequest(doc)
	).catch(console.error)
	return doc
}
const notifyNewManager = async guest => {
	console.log(`📮 notify manager ${guest.owner.email}`)
	await sendMail(
			guest.owner.email, //email goes to the general admin
			assignManager(guest)
		).catch(console.error)
	return guest
}