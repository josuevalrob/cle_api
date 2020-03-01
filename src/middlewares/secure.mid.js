import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

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