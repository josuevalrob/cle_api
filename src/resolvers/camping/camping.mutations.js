import CampingModel from './../../models/camping.model'
import {GuestModel} from './../../models/guest.model'
import sendMail from './../../helpers/mail.helper'
import {secure} from './../../middlewares/secure.mid'
const turno = {path:'turno',populate: ['owner', 'team.user']}

const Mutation = {
	createCamping: secure(async (root, {input}, context) => {
    const patreon = await context.User.findOne({email:input.patreonEmail})
    const guest = await GuestModel.findOne({email:input.patreonEmail})
    if(!patreon) {
      // in this point, there was a problem with invitation of the patreon.
      // maybe it is just in standby, or there was problem sending it, or anything.
      if(!guest){
        // if there is not guest neither, then we need to create a new one.
        // sadly, the patron field will be empty? //? can we fill it with the owner?
				//TODO create a new invitation.
				// ! i cant, cus i dont have all the required inputs.
				throw new Error('You need a patreon or a guest to proceed')
      }
    }
    // we have a patreon!
    const camping = new CampingModel({
      ...input,
      ...(!!patreon && {patreon: patreon.id}),
      ...(!!guest && {guest: guest.id}),
      owner: context.req.user.id,
    })
    camping.id = camping._id
    console.log('🏕 ', camping)
    return new Promise (( resolve, reject ) =>
      camping.save(async (err) => {
				if(!!err) reject(err)
        const fullCamping = await camping
																	.populate(turno)
																	.populate('guest')
																	.populate('patreon')
																	.populate('owner')
																	.execPopulate()
				//* sending email to the patreon.
				const {accepted} = await sendMail(fullCamping.patreon.email, invToCamping(fullCamping)).catch(console.error)
				console.log(accepted.includes(doc.email) ? `email send to ${fullCamping.patreon.email}` : '🙅🏻‍♂️ there was an error sending email')
				resolve(fullCamping)
      })
    )
	}),
	updateCamping: secure((root, {input}) => {
		return new Promise ((resolve, object) =>
			CampingModel.findOneAndUpdate(
				{_id : input.id} ,
				input, // new data!
				{new:true, useFindAndModify:false}, //si el registro no existe, crea uno nuevo
				(error, camping) => error //callback
					? rejects(error)
					: resolve(
							camping
                .populate(turno)
                .populate('guest')
                .populate('patreon')
                .populate('owner')
							.execPopulate()
					)
			)
		)
	}),
	deleteCamping: secure((root, {id}) => {
		console.log('💀 ',id)
		return new Promise ((resolve, object) =>
			CampingModel.findOneAndRemove(
				{_id : id} ,
				(error, cliente) => error //callback
					? rejects(error)
					: resolve("Se elimino correctamente")
			)
		)
	})
}

export default Mutation
