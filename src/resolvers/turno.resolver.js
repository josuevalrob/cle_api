import turno from './../models/turno.model'

const Query = {
	getTurno: secure((_, {id}, context) => userFindById(id)),
	getTurnos: secure((_, {limit, offset}) => User.find({}).limit(limit).skip(offset))
}

const Mutation = {
	createTurno:
	updateTurno:
	deleteTurno:
}
