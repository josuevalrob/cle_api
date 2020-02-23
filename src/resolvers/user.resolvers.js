import User from '../models/user.model'

const Query = {}
const Mutation =  {        
    register : async (root, {name, email, password}) => {
        const existUser = await User.findOne({ email })
        if (existUser) {
            console.log(existUser)
            throw new Error ('🙅🏻‍♂️ 📫 Email already registered')
        }
        const newUser = new User({name, email, password}).save();
        return 'User Created 📬 📪 📭'
    }
}

export default {Query, Mutation}