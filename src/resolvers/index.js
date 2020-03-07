import userResolver from './user.resolvers'
import guestResolver from './guest.resolver'
import turnResolver from './turno.resolver'
// import {clientResolver} from './clientes.resolver'
import {merge} from 'lodash'

const resolvers = merge(userResolver, guestResolver, turnResolver)
// console.log(resolvers)
export default resolvers


