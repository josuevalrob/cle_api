import mongoose from 'mongoose'
import {EMAIL_PATTERN, USER_ROL} from './user.model'
export const guestStatus = ['STANDBY','SEND', 'ACCEPTED', 'DENIED', 'DELETED']
const guestSchema = new mongoose.Schema({
	firstName:{
    type:String,
    required: [true, 'give me your name, at least 3 letters'],
    minlength: 3
  },
	email: {
		type: String,
		required: [true, 'Email required'],
		unique: [true, 'email unique'], 
		trim: true,
		match: EMAIL_PATTERN
	},
	letter: String, //TODO set maximum string size
	status: {
		type: String,
		enum: guestStatus,
		default: guestStatus[0]
	},
	owner: mongoose.ObjectId,
	protected: {
		type: Boolean,
		default: false
	},
	rol: {
    type: String,
    enum: USER_ROL,
    default: 'patron'
  },
}, {
	timestamps: true,
})
const GuestModel = mongoose.model('Guest', guestSchema)
export {GuestModel}

async (root, {email, status}, context) => {
	const {id} = context.req.user
	let mailSend = false
	const guest = GuestModel.findOne({email})
	console.log(guest.protected, guest.owner)
	if(!!guest && guest.protected && guest.owner === id){
		//* await send mail
		mailSend = true
		guest.save({status:'SEND'})
	} else if(guest.protected && guest.owner !== id) {
		//! await send mail
		throw new Error (`${email} is protected, and is not your user. `)
	} else if(guest) {
		//* await send mail
		mailSend = true
		guest.save({status:'SEND'})
	} else {
		throw new Error (`Guest ${email} doesn´t exist, please, create it first`)
	}
	return mailSend
	
}