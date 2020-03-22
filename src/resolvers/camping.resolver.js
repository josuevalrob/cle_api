import CampingModel from './../models/camping.model'
import {GuestModel} from './../models/guest.model'
import {secure} from './../middlewares/secure.mid'
const turno = {path:'turno',populate: ['owner', 'team.user']}
const Query = {
	getCamping: secure( (_, {id}, context) =>
		new Promise((resolve, reject) =>
		 	CampingModel
        .findById(id)
        .populate(turno)
        .populate('guest')
        .populate('patreon')
        .populate('owner')
				.then((turno, err) => {
					if(err) reject(err)
					else resolve(turno)
				}
			)
		)
	),
	getCampings: secure( (_, {turnoId, limit, offset}, context) =>
		new Promise((resolve, reject) =>
			CampingModel
				.find({turno: turnoId})
        .populate(turno)
        .populate('guest')
        .populate('patreon')
        .populate('owner')
        .limit(limit).skip(offset)
				.then((turno, err) => {
					if(err) reject(err)
					else resolve(turno)
				}
			)
		)
	)
}

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
        console.log(fullCamping)
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

export default {Query, Mutation}
