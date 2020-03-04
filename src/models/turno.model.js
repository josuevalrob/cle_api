import mongoose, {Schema, mongo} from 'mongoose'
export const turnKind = ['camping', 'convi', 'matri', 'sacerdotes', 'mixta', 'pro']

const turnoSchema = new Schema({
	//* Basic Data.
	kind: {
		type: String,
		enum: turnKind,
		default: turnKind[0]
	},
	name: {
		type:String,
		required: [true, 'The turn name require at least 3 characters'],
		minlength: 3
	},
	description: {
		type: String, 
		maxlength: 240, 
		minlength: 140,
		required: [true, 'At least give me a tweet'],
	},
	bannerPhoto: String,
	//* Teamwork
	availableCharges: [{
		type: String
	}],
	team: [{
		//! validate in a turnoSchem.pre() if the mongoose.ObjectId exist.
		name: mongoose.ObjectId,
		charge: {
			type: String,
			//! validate if the charge is already in the availableCharges field
			// require : (chr) => this.availableCharges.some(elm => elm === chr)
		}
	}],
	//* Tipos de turnos. (acampado, montiro, bebé, etc)
	foodOptions: [nameAndLabelSchema],
	permissions: [nameAndLabelSchema],
	campingType : [{
		name: mongoose.ObjectId,
		foodOptions: [BooleanLabelSchemas],
		permissions: [BooleanLabelSchemas]
	}]
	//* fechas del campamento. Configuración. 
})

BooleanLabelSchemas = new Schema({
	nameAndLabelSchema,
	status: Boolean
});

nameAndLabelSchema = new Schema({
	name: { type: String, trim: true, required: true },
	label: { type: String, required: true, maxlength: 20 },
})

const Turno = mongoose.model('Turno', turnoSchema);
export default Turno;