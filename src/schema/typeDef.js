import user from './user.graphql'
// import client from './client.graphql'
import guest from './guest.graphql'
import turno from './turno.graphql'


import {mergeTypes} from 'merge-graphql-schemas'
const types = [
	user,
	// client,
	turno,
	guest
];
export const typeDefs = mergeTypes(types, { all: true })