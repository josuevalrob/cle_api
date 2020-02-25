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

        const newUser = await context.User(input).save(fn=>{
            // context.login(newUser);
            console.log('newUser! ', fn, '🙅🏻‍♂️')
        });
        //* here should be the loggin 
        return 'User Created 📬 📪 📭'
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