//environment variables
require('dotenv').config();
//🌩 connected to de database 🗄️
require('./configs/bd.config');
import User from './models/user.model'
// 👮🏻‍🚔 passport access
require('./configs/passport.config');
//server imports
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
const port = normalizePort(process.env.PORT);
//routes
import rootPath from './routes/root.route'
//types and resolvers. 
import {typeDefs} from './schema/typeDef'
import resolvers from './resolvers'
//party 🎉
const app = express()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => buildContext({ req, res, User }),
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
})

app.use('/', rootPath)
// app.use('/', graphQlRouter)
server.applyMiddleware({app}) //connecta Apollo with express

app.listen(port, () => console.log(`Server Ready 🚀 on port ${port}`))


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