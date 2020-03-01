import client from './client.graphql'
import user from './user.graphql'
import guest from './guest.graphql'

import {mergeTypes} from 'merge-graphql-schemas'
const types = [
	client,
	user,
	guest
];
export const typeDefs = mergeTypes(types, { all: true })