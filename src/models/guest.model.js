import mongoose from 'mongoose'
import EMAIL_PATTERN from './user.model'
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
})
const Guest = mongoose.model('clientes', guestSchema)
export {Guest}