import User from '../models/user.model'

export const resolvers = {
    Query: {}, 
    Mutation: {
        createUser: async(root, {name, email, password}) =>{
            const newUser = await User({
                email,
                password,
                name
            })

            console.log(newUser)
        }
    }
}