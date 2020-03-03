import User from '../models/user.model'
import {secure, isOwner} from './../middlewares/secure.mid'

export const modelFinderById = model => id => new Promise ((resolve, rejects) =>
  model.findById(id, (err, doc) => err ? rejects(err): resolve(doc)))

const userFindById = modelFinderById(User)

const Query = {
  currentUser: secure((parent, _, {req:{user:{id}}}) => userFindById(id)),
  getUser: secure((_, {id}, context) => userFindById(id)),
  getUsers: secure((_, {limit, offset}) => User.find({}).limit(limit).skip(offset))
}

const Mutation =  {
  //* just for admin
  signup : async (root, {input}, context) => {
    console.log('📩 ', input.email)
    const existUser = await context.User.findOne({email:input.email})
    if (existUser) throw new Error ('🙅🏻‍♂️ 📫 Email already registered')
    const newUser = new context.User(destructureUser(input))
    const userSaved = await newUser.save();
    if(!userSaved) throw new Error ('💽 there was a problem saving the user')
    console.log('User Created 📬 📪 📭', userSaved)
    await context.login(userSaved);
    return {user: newUser}
  },
  login : async (root, {email, password}, context) => {
    const { user } = await context.authenticate('graphql-local', { email, password });
    if (!user) throw new Error ('🙅🏻‍♂️ There was a problem with the user o the password 🛂')
    context.login(user); //🎫
    return { user }
  },
  logout: (root, {email, password}, context) => context.logout(),

  updateUser: isOwner(async (root, {input}, context) => {
    console.log(input)
    const {user} = context.req
    Object.assign(user, input);
    const userSaved = await user.save();
    if(!userSaved) throw new Error ('💽 there was a problem saving the user')
    return user
  }, true, true) //sudo and admin has access.
}

export default {Query, Mutation}

export const destructureUser = (input) => ({
  id: input.id,
  rol: input.rol,
  email: input.email,
  password: input.password,
  firstName: input.firstName,
  lastName: input.lastName,
  phone: input.phone,
  Country: input.Country,
  City: input.City,
  birth: input.birth,
  profilePhoto: input.profilePhoto,
})