import {modelFinderById} from './user.queries';
import User from '../../models/user.model';
import {secure, isOwner} from './../../middlewares/secure.mid';
import {GuestModel} from './../../models/guest.model';

const userFindById = modelFinderById(User)

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
  }, true, true), //sudo and admin has access.
  deleteUser : secure(async (root, {id}, context) => {
    console.log('💀 ', id)
    const {user} = context.req
    const condemn = await userFindById(id)
    const guest = await GuestModel.findOne({email: condemn.email})
    const {owner, isProtected} = guest
    console.log(guest)
    const canDie = isProtected
      ? owner == user.id || user.rol == 'sudo'
      : user.rol == 'admin' || user.rol == 'sudo'
    return canDie
      ? new Promise ((resolve, rejects) =>
          condemn.remove(error => error //callback
              ? rejects(error)
              : resolve((async () => {
                  guest.status = 'DELETED'
                  const updateStatus = await guest.save()
                  return !!updateStatus 
                    ? "Se elimino correctamente"
                    : rejects('Ha ocurrido un problema actualizando el guest')
                })())
          )
        )
      : "No tienes permisos para eliminar"
    // const creator = await userFindById(owner)
  })
}

export default Mutation
