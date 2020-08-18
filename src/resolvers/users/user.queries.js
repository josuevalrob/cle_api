import User from '../../models/user.model'
import { secure } from './../../middlewares/secure.mid'
export const modelFinderById = model => id => new Promise ((resolve, rejects) =>
  model.findById(id, (err, doc) => err ? rejects(err): resolve(doc)));

const userFindById = modelFinderById(User)

const Query = {
  currentUser: secure((parent, _, {req:{user:{id}}}) => userFindById(id)),
  getUser: secure((_, {id}, context) => userFindById(id)),
  getUsers: secure((_, {input,limit, offset}) => User.find(input).limit(limit).skip(offset))
}

export default Query
