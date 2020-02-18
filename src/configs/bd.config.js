import mongoose from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.Promise = global.Promise

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() => console.info(`Successfully connected to de database 🗄️  ${MONGODB_URI}`))
  .catch(error => console.error(`An error ocurred trying to connect to the database ${MONGODB_URI}`, error))
