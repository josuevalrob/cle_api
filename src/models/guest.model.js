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
	isProtected: {
		type: Boolean,
		default: false
	},
	rol: {
    type: String,
    enum: USER_ROL,
    default: USER_ROL[0]
	},
	
}, {
	timestamps: true,
})
const GuestModel = mongoose.model('Guest', guestSchema)
export {GuestModel}