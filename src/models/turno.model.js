import mongoose, {Schema} from 'mongoose'
export const turnKind = ['camping', 'convi', 'matri', 'sacerdotes', 'mixta', 'pro']
const foodLabelSchema = new Schema({
	label:  {type: String, required: true, maxlength: 20 },
	status: {type:Boolean, default: false},
	price:  {
		type: Number,
		// get: n => n * 100,
		// set: n => (n/100).toFixed(2)
	}
});
export const labelAndDateSchema = new Schema({
	label: { type: String, required: true, maxlength: 20, minlength:3 },
	value: { type: Date, default: new Date() },
	transportDate:  {type:Boolean, default: false}, //appears in the profile field information
	beforeDate: String,
	afterDate: String,
})

const campingTypeSchema = new Schema({ //monitor, matrimonio, acampado, etc...
	name: {
		type: String,
		maxlength: 20,
		minlength: 3,
		required: [true, 'More than 3, less than 20'],
	},
	foodOptions: [foodLabelSchema],
	permissions: [foodLabelSchema],
})

const turnoSchema = new Schema({
	//* Basic Data.
	kind: {
		type: String,
		enum: turnKind,
		default: turnKind[0]
	},
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	name: {
		type:String,
		required: [true, 'The turn name require at least 3 characters'],
		minlength: 3
	},
	description: {
		type: String,
		maxlength: 240,
		required: [true, 'At least give me a tweet'],
	},
	// bannerPhoto: String,
	//* Teamwork
	availableCharges: [{type: String,maxlength: 20, minlength: 3,}],
	team: [{
		//! validate in a turnoSchem.pre() if the mongoose.ObjectId exist.
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		charge: { type: String, maxlength: 20, minlength: 3,
			//! validate if the charge is already in the availableCharges field
			// require : (chr) => this.availableCharges.some(elm => elm === chr)
		}
	}],
	//* Tipos de turnos. (acampado, montiro, bebé, etc)
	campingType : [campingTypeSchema],
	nightPrice:  {
		type: Number,
		default: 0,
		// get: n => n * 100,
		// set: n => (n/100).toFixed(2)
	},
	//* Fecha input:
	dates: [labelAndDateSchema],
	//* Food Table.
})

const Turno = mongoose.model('Turno', turnoSchema);
export default Turno;