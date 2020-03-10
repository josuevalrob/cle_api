import mongoose, {Schema, mongo} from 'mongoose'
export const turnKind = ['camping', 'convi', 'matri', 'sacerdotes', 'mixta', 'pro']

const BooleanLabelSchemas = new Schema({
	label:{ type: String, required: true, maxlength: 20 },
	status: {type:Boolean, default: false}
});

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
	// bannerPhoto: String,
	//* Teamwork
	availableCharges: [{
		type: String
	}],
	team: [{
		//! validate in a turnoSchem.pre() if the mongoose.ObjectId exist.
		helperId: mongoose.ObjectId,
		charge: {
			type: String,
			//! validate if the charge is already in the availableCharges field
			// require : (chr) => this.availableCharges.some(elm => elm === chr)
		}
	}],
	//* Tipos de turnos. (acampado, montiro, bebé, etc)
	foodOptions: [{ type: String, required: true, maxlength: 20 }],
	permissions: [{ type: String, required: true, maxlength: 20 }],
	campingType : [{ //monitor, matrimonio, acampado, etc...
		name: {
			type: String,
			maxlength: 20,
			minlength: 3,
			required: [true, 'More than 3, less than 20'],
		},
		foodOptions: [BooleanLabelSchemas],
		permissions: [BooleanLabelSchemas]
	}],
	//* fechas del campamento. Configuración.
	dateTypes: [{
		label: { type: String, required: true, maxlength: 20 },
		beforeDate: String,
		afterDate: String
	}],
	//* Fecha input:
	// dates: [{
	// 	kind: {
	// 		type: String,
	// 		// require: () =>  //! validate if the kind is the same from dateTypes
	// 	},
	// 	value: {
	// 		type: Date,
	// 		// require: ()=>			//! check if the beforeDate and afterDate are ok
	// 	},
	// }]
	//* Food Table.

})

const Turno = mongoose.model('Turno', turnoSchema);
export default Turno;