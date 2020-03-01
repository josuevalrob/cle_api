//environment variables
require('dotenv').config();
//🌩 connected to de database 🗄️
require('./configs/bd.config');
import User from './models/user.model'
// 👮🏻‍🚔 passport access
import passport from 'passport';
import { buildContext, GraphQLLocalStrategy } from 'graphql-passport';
require('./configs/passport.config');
//🎟 Import session tracker
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';

//server imports
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
const port = normalizePort(process.env.PORT);
//routes
import rootPath from './routes/root.route'
import authRoutes from './routes/auth.routes'
//types and resolvers. 
import {typeDefs} from './schema/typeDef'
import resolvers from './resolvers'
//party 🎉
const app = express()
//Express session: 🎟 It provides the functionality to save session data in a storage that you choose
app.use(session({
  genid: (req) => uuidv4(),
  secret: process.env.SESSION_SECRECT,
  resave: false,
  saveUninitialized: false,
  //! set in env variable
  // cookie: { secure: true } //enforece https session in production environment. 
}));

// 👮🏻‍🚔 passport init
app.use(passport.initialize())
app.use(passport.session());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    if(req.user) console.log(`🏃‍♀️ ${req.user ? req.user.email : '🙅🏻‍♂️'}`)
    return buildContext({ req, res, User })
  },
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
})

app.use('/', rootPath) //maybe i dont need this...
app.use('/auth', authRoutes)
// app.use('/', graphQlRouter)
server.applyMiddleware({app}) //connecta Apollo with express

app.listen(port, () => console.log(`Server Ready 🚀 #${Date.now()}, on port ${port}`))


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}