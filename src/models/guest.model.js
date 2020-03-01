import mongoose from 'mongoose'
import {EMAIL_PATTERN} from './user.model'
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
	}
}, {
	timestamps: true,
})
const Guest = mongoose.model('Guest', guestSchema)
export {Guest}