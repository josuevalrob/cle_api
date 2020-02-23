import userResolver from './user.resolvers'
import {clientResolver} from './clientes.resolver'
import {merge} from 'lodash'

const resolvers = merge(userResolver, clientResolver)

export default resolvers


