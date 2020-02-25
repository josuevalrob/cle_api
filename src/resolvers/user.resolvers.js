// import User from '../models/user.model'

const Query = {
    currentUser: (parent, {id}, context) =>
        new Promise ((resolve, rejects) =>
            context.User.findById(
                id,
                (error, User) => error //callback
                    ? rejects(error)
                    : resolve(User)
            )
        ),
}
const Mutation =  {
    signup : async (root, input, context) => {
        const existUser = await context.User.findOne({ email:input.email })
        if (existUser) {
            console.log(existUser)
            throw new Error ('🙅🏻‍♂️ 📫 Email already registered')
        }
        const userSaved = await context.User.save(newUser);
        if(userSaved) {
            console.log('User Created 📬 📪 📭', userSaved)
            //* here should be the loggin 
        }
        const userLogged = userSaved && await context.login(newUser);

        return userLogged ? { user: newUser } : 'Hubo un error ⛔️';
    },
    login : async (root, {email, password}, context) => {
        const { user } = await context.authenticate('graphql-local', { email, password });
        if (!user) {
            throw new Error ('🙅🏻‍♂️ There was a problem with the user o the password 🛂')
        }
        context.login(user); //🎫
        return { user }
    },
    logout:(root, {email, password}, context) => {
        context.logout()
    }
}

export default {Query, Mutation}