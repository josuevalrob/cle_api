import TurnoModel, { turnKind } from './../models/turno.model'
import {secure} from './../middlewares/secure.mid'

const Query = {
	getTurno: secure( (_, {id}, context) =>
		new Promise((resolve, reject) =>
		 	TurnoModel
				.findById(id)
				.populate('owner')
				.populate('team.user')
				.then((turno, err) => {
					if(err) reject(err)
					else resolve(turno)
				}
			)
		)
	),
	getTurnos: secure( (_, {id}, context) =>
		new Promise((resolve, reject) =>
			TurnoModel
				.find({})
				.populate('owner')
				.populate('team.user')
				.then((turno, err) => {
					if(err) reject(err)
					else resolve(turno)
				}
			)
		)
	)
}

const Mutation = {
	createTurno: secure((root, {input}, context) => {
		const foodHanlder = labelMatcher(input.foodOptions)
		const permHanlder = labelMatcher(input.permissions)
		const newTurn = new TurnoModel({
			...input, //extract each field that requires to be handled
			owner: context.req.user.id,
			campingType: validateCampingType(input.campingType, foodHanlder, permHanlder),
		})
		newTurn.id = newTurn._id
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
					: resolve(turno
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

export default {Query, Mutation}

const validateCampingType = (campingType = [], foodHanlder, permHanlder) =>
	campingType.map(profile => ({
		...profile, //here comes name props, any any other in the future
		foodOptions: foodHanlder(profile.foodOptions),
		permissions: permHanlder(profile.permissions),
	}))

const matcher = key => haystack => needle => !!needle
	?	haystack.map(value => ({
			[key]: value,
			status: needle.reduce((a,b) => b[key] === value ? b.status : a, false),
		}))
	: haystack.map(value => ({[key]: value, status: false}))

const labelMatcher = matcher('label')
