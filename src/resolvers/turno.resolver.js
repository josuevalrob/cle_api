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
		const newTurn = new TurnoModel(turnoInputHandler({
			...input, owner: context.req.user.id
		}))
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
				turnoInputHandler(input), // new data!
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

export default {Query, Mutation}

const validateCampingType = (campingType = [], foodHanlder, permHanlder) =>
	campingType.map(profile => ({
		...profile, //here comes name props, any any other in the future
		foodOptions: foodHanlder(profile.foodOptions),
		permissions: permHanlder(profile.permissions),
	}))

/**
 * Curried functions for return {[key]:'something', status: true}
 * returns a function which expect an haystack which expect
 * a needle to find if  inside that needle is the key, if not, return false.
 * @param {string} key string to compare with the value
 */
const keyStatus = key => haystack => needle => !!needle
	?	haystack.map(value => ({
			[key]: value,
			status: needle.reduce((a,b) => b[key] === value ? b.status : a, false),
		}))
	: haystack.map(value => ({[key]: value, status: false}));

/**
 * return a keyStatus curried function setted with a 'label' value
 * for return {label:'something', status: true}
 */
const labelMatcher = keyStatus('label');

/**
 * Extract each field that requires to be handled
 * and return the data treated with default values
 * @param {object} input object.
 */
const turnoInputHandler = input => {
	const {dateTypes, dates=[], foodOptions, permissions} = input
	const foodHanlder = labelMatcher(foodOptions)
	const permHanlder = labelMatcher(permissions)
	return {
		...input,
		campingType: validateCampingType(input.campingType, foodHanlder, permHanlder),
		dates: !Array.isArray(dateTypes) ? [] //create an empty array
			: dateTypes
				.map(({label}) => ({ //return an object
					label,
					value: dates.reduce((a,b) =>
						b[key] === value
							? b.status
							: a,
					new Date()),
				}))
	}
}