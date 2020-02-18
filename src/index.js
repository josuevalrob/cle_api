//environment variables
require('dotenv').config();
require('./configs/bd.config');
const port = normalizePort(process.env.PORT);
//server imports
import express from 'express'
//routes
import rootPath from './routes/root.route'
import graphQlRouter from './routes/graphQl.route'
//party 🎉
const app = express()

app.use('/', rootPath)
app.use('/', graphQlRouter)

app.listen(port, () => console.log(`server on port ${port} ready`))


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