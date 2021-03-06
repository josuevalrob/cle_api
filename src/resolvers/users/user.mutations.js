import {modelFinderById} from './user.queries';
import User from '../../models/user.model';
import {secure, isOwner} from './../../middlewares/secure.mid';
import {GuestModel} from './../../models/guest.model';
import {ALREADY_REGISTER ,NO_PERMISSIONS_DELETE ,DELETED_BUT_NOT_GUEST_UPDATED ,GUEST_UPDATE_ERROR ,USER_OR_PASSWORD_PROBLEM ,SUCCESS_DELETED} from './user.resolver';

const userFindById = modelFinderById(User)
//TODO: use the UserFields from queryTest file
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
  //! really? why do we have this? maybe it should be deleted!!
  signup : async (root, {input}, context) => {
    // console.log('📩 ', input.email) 
    const existUser = await context.User.findOne({email:input.email})
    if (existUser) throw new Error (ALREADY_REGISTER)
    const newUser = new context.User(destructureUser(input))
    const userSaved = await newUser.save();
    if(!userSaved) throw new Error ('💽 there was a problem saving the user')
    // console.log('User Created 📬 📪 📭', userSaved)
    await context.login(userSaved);
    return {user: newUser}
  },

  login : async (root, {email, password}, context) => {
    const { user } = await context.authenticate('graphql-local', { email, password });
    if (!user) throw new Error (USER_OR_PASSWORD_PROBLEM)
    await context.login(user); //🎫
    console.log('💃 ', context.req.user)
    return { user }
  },

  logout: (root, {email, password}, context) => context.logout(),

  updateUser: isOwner(async (root, {input}, context) => {
    console.log('💃 ', input);
    const {user} = context.getUser();
    Object.assign(user, input);
    // ! all the validation shoudn´t be in the mongoose side!!
    // ? isOwner wrapper has all the logic (?)
    // TODO: what is going on here??
    const userSaved = await user.save();
    if(!userSaved) throw new Error ('💽 there was a problem saving the user')
    return user
  }, true, true), //sudo and admin has access.

  deleteUser : secure(async (root, {id}, context) => {
    // console.log('💀 ', id)
    const {user} = context.req;
    const condemn = await userFindById(id);
    const guest = await GuestModel.findOne({email: condemn.email});
    const {owner, isProtected} = guest || {};
    const canDie = !!guest && isProtected
      ? owner == user.id || user.rol == 'sudo'
      : user && (user.rol == 'admin' || user.rol == 'sudo');

    return canDie
      ? new Promise ((resolve, rejects) =>
          condemn.remove(error => error //callback
              ? rejects(error)
              : resolve((async () => {
                  if (!guest) {
                    return DELETED_BUT_NOT_GUEST_UPDATED;
                  }
                  guest.status = 'DELETED'
                  const updateStatus = await guest.save()
                  return !!updateStatus
                    ? SUCCESS_DELETED
                    : rejects(GUEST_UPDATE_ERROR)
                })())
          )
        )
      : NO_PERMISSIONS_DELETE
    // const creator = await userFindById(owner)
  })
}

export default Mutation
