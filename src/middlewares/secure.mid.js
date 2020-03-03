import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

/**
 * Protect queries with authenticate user or for one of the mains roles.
 * @param {callback} func expect root, args and context
 * @param {boolean} sudo accesible just for super admin
 * @param {boolean} admin accesible for admin
 * @param {boolean} patron accesible just for patrons. 
 */
export function secure (func, sudo = false, admin = false, patron =  false) {
	return (root, args, context) => {
		if (!context.req.user) throw new AuthenticationError('Unauthenticated')
		// sudo only
		return func(root, args, context)
	}
}

export function secureUserOnly (func, userId = 'userId') {
	return (root, args, context) => {
		if (!context.user) throw new AuthenticationError('Unauthenticated')
		else if (
			!context.user.sudo &&
			!context.user.admin &&
			args[userId] !== context.user.id
		) {
			throw new ForbiddenError('Unauthorized')
		}
		return func(root, args, context)
	}
}
/**
 * Protect queries and make it accesible just for owners.
 * @param {callback} func expect root, args and context
 * @param {boolean} sudo accesible just for super admin
 * @param {boolean} admin accesible for admin
 * @param {boolean} patron accesible just for patrons.
 */
export function isOwner (func, sudo = false, admin = false, patron =  false) {
	return (root, args, context) => {
		if(!args.input) 			 throw new UserInputError('We need the input key with the user')
		if (!context.req.user) 		 throw new AuthenticationError('Unauthenticated')
		const {id, rol} = context.req.user
		const isMine = args.input.id == id
		if( !isMine ) 	 throw new ForbiddenError('Protected by owner')
		if(!isMine && admin && rol !== 'admin') throw new ForbiddenError('Protected by admin')
		if(!isMine && sudo && rol !== 'sudo' )  throw new ForbiddenError('Protected by Super User')
		// sudo or owner
		return func(root, args, context)
	}
}