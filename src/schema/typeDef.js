import client from './client.graphql'
import user from './user.graphql'
import {mergeTypes} from 'merge-graphql-schemas'
const types = [
	client,
	user
];
export const typeDefs = mergeTypes(types, { all: true })