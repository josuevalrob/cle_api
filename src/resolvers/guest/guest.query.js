import {GuestModel} from './../../models/guest.model'
import {secure} from './../../middlewares/secure.mid'

const Query = {
	getGuest: secure((parent, {id}, context) =>
		new Promise((resolve, reject) =>
			GuestModel
				.findById(id)
				.populate('owner')
				.then((guest, err) => {
					if(err) reject(err)
					else resolve(guest)
				}
			)
		)
	),
	getGuests: secure((root, {input, limit, offset}) =>
		new Promise((resolve, reject) =>
			GuestModel
				.find(input)
				.populate('owner')
				.limit(limit)
				.skip(offset)
				.then((guest, err) => {
					if(err) reject(err)
					else resolve(guest)
				}
			)
		)
	),
	getMyGuests: secure((root, {limit, offset}, context) =>
		new Promise((resolve, reject) =>
			GuestModel
				.find({owner: context.req.user.id})
				.populate('owner')
				.limit(limit)
				.skip(offset)
				.then((guest, err) => {
					if(err) reject(err)
					else resolve(guest)
				}
			)
		)
	),
}


export default Query
