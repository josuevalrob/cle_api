import TurnoModel, { turnKind } from './../../models/turno.model'
import {secure} from './../../middlewares/secure.mid'

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
	getTurnos: secure( (_, {input}, context) =>
		new Promise((resolve, reject) =>
			TurnoModel
				.find(input)
				.populate('owner')
				.populate('team.user')
				.then((turno, err) => {
					if(err) reject(err)
					// console.log()
					// const enrolled = await Promise.all([
					// 	turnos.map(async turno => await CampingModel.countDocuments({turno: turno._id}))
					// ])
					// console.log(enrolled)
					else resolve(turno)
				}
			)
		)
	)
}


export default Query
