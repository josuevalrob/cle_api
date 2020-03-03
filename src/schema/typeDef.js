import user from './user.graphql'
// import client from './client.graphql'
import guest from './guest.graphql'

import {mergeTypes} from 'merge-graphql-schemas'
const types = [
	user,
	// client,
	guest
];
export const typeDefs = mergeTypes(types, { all: true })