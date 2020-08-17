import mongoose from 'mongoose'


const isOnDev = () => process.env.NODE_ENV === 'DEV';

function connectDB() {
  const MONGODB_URI = isOnDev() ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI_PRO;
  mongoose.Promise = global.Promise
  isOnDev() && console.log(`Preparing ${process.env.NODE_ENV} connection 💻`)
  return mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      isOnDev() && 
      console.info(` 🌩  connected to de database 🗄️  ${isOnDev() ? MONGODB_URI : true}`)
    })
    .catch(error => {
        isOnDev() && 
        console.error(`💥 An error ocurred trying to connect to the database ${MONGODB_URI}`, error)
    })
}

async function stopDatabase() {
  await mongoose.connection.close();
}

module.exports = {
  connectDB,
  stopDatabase,
};