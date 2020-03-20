import user from './user.graphql'
// import client from './client.graphql'
import guest from './guest.graphql'
import turno from './turno.graphql'
import camping from './camping.graphql'


import {mergeTypes} from 'merge-graphql-schemas'
const types = [
	user,
	// client,
	turno,
	guest,
	camping
];
export const typeDefs = mergeTypes(types, { all: true })