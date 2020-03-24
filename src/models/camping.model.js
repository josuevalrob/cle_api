import {Schema, model} from 'mongoose'
import {EMAIL_PATTERN} from './user.model'
import {labelAndDateSchema} from './turno.model'
const basicDataSchema = new Schema({
  //! add basic data!
firstName:{
    type:String,
    required: [true, 'give me your name, at least 3 letters'],
    minlength: 3
  },
lastName: {
    type: String,
    minlength: 3
  },
birth: Date,
profilePhoto: String,
alergies: [{ type: String, required: true, maxlength: 20, minlength:3 }],
medication: [{ type: String, required: true, maxlength: 20, minlength:3 }],
curso: { type: String, required: true, maxlength: 20, minlength:3 },
});

const CampingSchema = new Schema({
  //where does this camping belongs.
  turno: { type: Schema.Types.ObjectId, ref: 'Turno'},
  // // invitation to
  // // ? what about if the guest is already a user??
  guest: { type: Schema.Types.ObjectId, ref: 'Guest' },
  // confirmation from
  patreonEmail: {
    type: String,
    required: [true, 'Email required'],
    trim: true,
    match: EMAIL_PATTERN
  },
  patreon: { type: Schema.Types.ObjectId, ref: 'User' },
  owner:  { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true, maxlength: 20, minlength:3 },
  // CampingType
  //? how to handle multiple guest invitation, if there is just one patreon reference
  // // with the campingProfileSchema array
  //* with multiple guest invitations. No array. each campingSchema belongs to one camping
  basicData: basicDataSchema,
  contactData: basicDataSchema,
  transporte: [labelAndDateSchema],
  scheduleFood: [{
    //* this data will be multiply by the nightPrice and the food price
    //* to get the day price on the bworser.
    //graphQl will return the available dates.
    day: Date, //date must be in range. check it in the resolver
    value: { type: String, required: true, maxlength: 20 }
  }]
})


const Camping = model('Camping', CampingSchema);

export default Camping