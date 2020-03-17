import {Schema, model} from 'mongoose'
import {labelAndDateSchema} from './turno.model'

const CampingSchema = new Schema({
  //where does this camping belongs.
  turno: { type: Schema.Types.ObjectId, ref: 'Turno', unique:true},
  // invitation to
  // ? what about if the guest is already a user??
  guest: { type: Schema.Types.ObjectId, ref: 'Guest', unique:true },
  // confirmation from
  patron: { type: Schema.Types.ObjectId, ref: 'User', unique:true },
  // CampingType
  //? how to handle multiple guest invitation, if there is just one patreon reference
  //* with the campingProfileSchema array
  profile : [campingProfileSchema]
})

const campingProfileSchema = new newSchema({
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


const Camping = model('Camping', CampingSchema);

export default Camping