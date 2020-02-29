import { Router } from 'express'
import passport from 'passport'
const router = Router()

// GOOGLE
router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email'],
	})
)

router.get(
	'/google/redirect',
	passport.authenticate('google', {
			failureRedirect: process.env.CLIENT_LOGIN,
			session: false,
	}),
	handlePassportError,
	(req, res) => {
		// todo redirect users to client accordingly
		console.log('⛔️⛔️⛔️⛔️⛔️ UNEXPECTED ⛔️⛔️⛔️⛔️⛔️')
		if (!req.user) res.status(404).send(errSchema('User not found', 404))
		res.cookie('token', req.user.token, {
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		httpOnly: true,
		})
		res.send(resSchema(req.user, res.statusCode))
	}
)

function handlePassportError (err, req, res, next) {
  if (err) {
		let data = {}
		console.log('⛔️⛔️⛔️⛔️⛔️ handlePassportError ⛔️⛔️⛔️⛔️⛔️')
    if (!(process.env.NODE_ENV === 'PRO')) {
      data.err = err
      res.status(500).send(errSchema(data, 500))
    }
  } else return next()
}

export default router