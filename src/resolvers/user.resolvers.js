// import User from '../models/user.model'

const Query = {
  currentUser: (parent, _, context) => {
    const {id} = context.req.user
    return new Promise ((resolve, rejects) =>
      context.User.findById(
        id,
        (error, User) => {
          // console.log(`👤 ${id}`)
          return error //callback
          ? rejects(error)
          : resolve(User)
        }
      )
    )
  },
}

const Mutation =  {
  signup : async (root, {input}, context) => {
    console.log('📩 ', input.email)
    const existUser = await context.User.findOne({email:input.email})
    if (existUser) throw new Error ('🙅🏻‍♂️ 📫 Email already registered')
    const newUser = new context.User({
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
    const userSaved = await newUser.save();
    if(!userSaved) throw new Error ('💽 there was a problem saving the user')
    console.log('User Created 📬 📪 📭', userSaved)
    await context.login(userSaved);
    // if(!isLogged) throw new Error ('Wops, there was a problem making the logging')
    return {user: newUser}
  },
  login : async (root, {email, password}, context) => {
    const { user } = await context.authenticate('graphql-local', { email, password });
    if (!user) throw new Error ('🙅🏻‍♂️ There was a problem with the user o the password 🛂')
    context.login(user); //🎫
    return { user }
  },
  logout:(root, {email, password}, context) => {
    context.logout()
  }
}

export default {Query, Mutation}
