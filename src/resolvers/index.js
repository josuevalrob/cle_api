import userResolver from './user.resolvers'
import guestResolver from './guest.resolver'
import {clientResolver} from './clientes.resolver'
import {merge} from 'lodash'

const resolvers = merge(userResolver, clientResolver, guestResolver)
// console.log(resolvers)
export default resolvers


