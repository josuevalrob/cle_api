import mongoose from 'mongoose'
const MONGODB_URI = process.env.NODE_ENV === 'DEV' ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI_PRO;

mongoose.Promise = global.Promise
console.log(`Preparing ${process.env.NODE_ENV} connection 💻`)
mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() => console.info(`🌩 connected to de database 🗄️  ${process.env.NODE_ENV === 'DEV' ? MONGODB_URI : true}`))
  .catch(error => console.error(`🙅🏻‍♂️ An error ocurred trying to connect to the database ${MONGODB_URI}`, error))
