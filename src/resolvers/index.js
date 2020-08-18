import userResolver from './users/user.resolver'
import guestResolver from './guest/guest.resolver'
import turnResolver from './turno/turno.resolver'
import campingResolver from './camping/camping.resolver'
// import {clientResolver} from './clientes.resolver'
import {merge} from 'lodash'

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const scalarResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  })
}
const resolvers = merge(
  userResolver,
  guestResolver,
  turnResolver,
  scalarResolvers,
  campingResolver
)
// console.log(resolvers)
export default resolvers