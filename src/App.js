//environment variables
require('dotenv').config();
//🌩 connected to de database 🗄️
import {connectDB} from './configs/bd.config';
import User from './models/user.model'
// 👮🏻‍🚔 passport access
import passport from 'passport';
import { buildContext } from 'graphql-passport';
require('./configs/passport.config');
//🎟 Import session tracker
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import cors from './configs/cors.config';
//server imports
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
//routes
import rootPath from './routes/root.route'
import authRoutes from './routes/auth.routes'
//types and resolvers. 
import {typeDefs} from './schema/typeDef'
import resolvers from './resolvers'
//party 🎉
connectDB();
const app = express();
app.use(cors);
app.use(express.urlencoded({extended: true}));

//Express session: 🎟 It provides the functionality to save session data in a storage that you choose
app.use(session({
  genid: (req) => uuidv4(),
  secret: process.env.SESSION_SECRECT,
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
  //! set in env variable
  // cookie: { secure: true } //enforece https session in production environment. 
}));

// 👮🏻‍🚔 passport init
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    console.log('💰', req.user)
    return buildContext({ req, res, User })
  },
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
});

app.use('/', rootPath) //maybe i dont need this...
app.use('/auth', authRoutes)
// app.use('/', graphQlRouter)
server.applyMiddleware({app}) //connecta Apollo with express

// Export our app for testing purposes
export default app;