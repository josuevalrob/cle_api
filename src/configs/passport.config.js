import User from './../models/user.model'
import passport from 'passport';
import { GraphQLLocalStrategy } from 'graphql-passport';


passport.serializeUser((user, next) => {
	console.log(user, '🙅🏻‍♂️')
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => next(null, user))
    .catch(next)
});

passport.use(
	new GraphQLLocalStrategy((email, password, next) => {
		console.log(`🎫  ${email} 🚔  👮‍♂`)
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

