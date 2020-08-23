import CampingModel from './../../models/camping.model';
import {secure} from './../../middlewares/secure.mid';
export const turno = {path:'turno',populate: ['owner', 'team.user']}
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
	getCampings: secure( (_, {input, limit, offset}, context) =>
		new Promise((resolve, reject) =>
			CampingModel
				.find(input)
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

export default Query
