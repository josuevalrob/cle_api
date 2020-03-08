import TurnoModel from './../models/turno.model'
import {secure} from './../middlewares/secure.mid'
import {modelFinderById} from './user.resolvers'

const Query = {
	getTurno: secure((_, {id}, context) =>
		modelFinderById(TurnoModel)(id)),
	getTurnos: secure((_, {limit, offset}) =>
		TurnoModel.find({}).limit(limit).skip(offset))
}

const Mutation = {
	createTurno: secure((root, {input}) => {
		const newTurn = new TurnoModel({
			kind: input.kind,
			name: input.name,
			description: input.description,
			availableCharges: input.availableCharges,
			team: input.team,
			foodOptions: setNameFromLabel(input.foodOptions),
			permissions: setNameFromLabel(input.permissions),
			campingType: input.campingType,
			dateTypes: input.dateTypes,
		})
		newTurn.id = newTurn._id
		console.log('📩 ', newTurn)
		return new Promise (( resolve, reject ) => {
			return newTurn.save(err => {
				if(err) reject(err)
				else resolve(newTurn)
			})
		})
	}),
	updateTurno: secure((root, {input}) => {
		console.log('😎 ',input)
		return new Promise ((resolve, object) =>
			TurnoModel.findOneAndUpdate(
				{_id : input.id} ,
				input, // new data! 
				{new:true, useFindAndModify:false}, //si el registro no existe, crea uno nuevo
				(error, cliente) => error //callback
					? rejects(error)
					: (()=>{
						console.log('🏠', cliente)
						resolve(cliente)
					})()
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

	const cleanLabel = label => label.split(/\s/).join('')//add more validations

	const setNameFromLabel = arr =>
		arr.map(obj =>
			({...obj, name: cleanLabel(obj.label)}))




export default {Query, Mutation}
