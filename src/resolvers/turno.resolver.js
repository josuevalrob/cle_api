import TurnoModel from './../models/turno.model'
import {secure} from './../middlewares/secure.mid'
import {modelFinderById} from './user.resolvers'

const Query = {
	getTurno: secure(async (_, {id}, context) => {
		const turno = await modelFinderById(TurnoModel)(id)
		console.log(turno)
		return turno
	}),
	getTurnos: secure((_, {limit, offset}) =>
		TurnoModel.find({}).limit(limit).skip(offset))
}

const Mutation = {
	createTurno: secure((root, {input}) => {
		const foodHanlder = labelMatcher(input.foodOptions)
		const permHanlder = labelMatcher(input.permissions)
		const newTurn = new TurnoModel({
			...input, //extract each field that requires to be handled
			campingType: validateCampingType(input.campingType, foodHanlder, permHanlder),
		})
		newTurn.id = newTurn._id
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
				(error, turno) => error //callback
					? rejects(error)
					: (()=>{
						// console.log('🏠', turno)
						resolve(turno)
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
