//environment variables
require('dotenv').config();
//🌩 connected to de database 🗄️  
require('./configs/bd.config');
//server imports
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
const port = normalizePort(process.env.PORT);
//routes
import rootPath from './routes/root.route'
//types and resolvers. 
import {typeDefs} from './schema/typeDef'
import {resolvers} from './resolvers/clientes.resolver'
//party 🎉
const app = express()
const server = new ApolloServer({typeDefs, resolvers})

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