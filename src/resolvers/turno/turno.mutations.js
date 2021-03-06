import TurnoModel from './../../models/turno.model'
import {secure} from './../../middlewares/secure.mid'

const Mutation = {
	createTurno: secure((root, {input}, context) => {
		const newTurn = new TurnoModel({
			...input,
			owner: context.req.user.id,
		})
		newTurn.id = newTurn._id
		console.log('🏕 ', newTurn)
		return new Promise (( resolve, reject ) =>
			newTurn.save(err => !!err
				? reject(err)
				: resolve(
						newTurn
						.populate('owner')
						.populate('team.user')
						.execPopulate()
					)
			)
		)
	}),
	updateTurno: secure((root, {input}) => {
		return new Promise ((resolve, object) =>
			TurnoModel.findOneAndUpdate(
				{_id : input.id} ,
				input, // new data!
				{new:true, useFindAndModify:false}, //si el registro no existe, crea uno nuevo
				(error, turno) => error //callback
					? rejects(error)
					: resolve(
							turno
							.populate('owner')
							.populate('team.user')
							.execPopulate()
					)
			)
		)
	}),
	deleteTurno: secure((root, {id}) => {
		console.log('💀 ',id)
		return new Promise ((resolve, object) =>
			TurnoModel.findOneAndRemove(
				{_id : id} ,
				(error, cliente) => error //callback
					? rejects(error)
					: resolve("Se elimino correctamente")
			)
		)
	})
}

export default Mutation
