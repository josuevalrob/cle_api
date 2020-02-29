import User from './../models/user.model'
import passport from 'passport';
import { GraphQLLocalStrategy } from 'graphql-passport';
import {OAuth2Strategy} from 'passport-google-oauth'

passport.serializeUser((user, next) => {
	console.log(user.id, ' 🔏')
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => next(null, user))
    .catch(next)
});

passport.use(
	new GraphQLLocalStrategy((email, password, next) => {
		console.log(`🎫 GraphQLLocalStrategy ${email} 🚔  👮‍♂`)
		User.findOne({ email })
			.then(user => !user
				? next(null, false, 'Invalid email or password')
				: user.checkPassword(password) //bcrypt
						.then(match => !match
							? next(null, false, 'Invalid email or password')
							: next(null, user)
						)
			)
			.catch(error => next(error))
	}),
);

passport.use(
	new OAuth2Strategy(
	  {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		// callbackURL: `http://localhost:${process.env.PORT}/google/redirect`,
		callbackURL: '/auth/google/redirect',
		profileFields: ['id', 'email', 'first_name', 'last_name'],
	  },
		async (request, accessToken, refreshToken, profile, done) => {
			console.log(`🤯 PROFile ${profile}`)
			try {
				const { id } = profile
				const email = profile.emails[0].value
				let user = await User.findOrCreate(email, id, provider, profile)
				done(null, user)
			} catch (e) {
				done(e)
			}
		},
	)
);