require('dotenv').config();
const what = process.env.npm_config_what // npm -what=users run seeds
const howMany = process.env.npm_config_many || 1
const rol = process.env.npm_config_rol
//* Import or generate the data
import faker from 'faker'
//* Import the model
import UsersModel from '../models/user.model'
import {GuestModel} from '../models/guest.model'
import User from '../models/user.model';
//* require mongoose
const mongoose = require('mongoose');
//* Import Database connection
require('../configs/bd.config');

console.log(`ready to import ${what} 📦`)

//* Create model with data.
//? User:
if(what === 'users') {
  UsersModel.create(new Array(howMany).fill(null).map(e => ({
      rol,
      "email" : faker.internet.email(),
      "password" : "123",
      "firstName" : faker.name.firstName(),
      "lastName" : faker.name.lastName(),
      "phone": faker.phone.phoneNumber(),
      "Country": faker.address.country(),
      "City": faker.address.city(),
      "birth": faker.date.past(),
      profilePhoto: faker.image.avatar()
  })))
  .then((users) => console.info(`${users.length} new users added to the database`))
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close());
}

if(what === 'guest') {
  UsersModel.findOne({rol:'admin'}) //this could be configured by params
    .then(admin => {
      if(!admin) throw Error('You need admin user for generate guest')
      GuestModel.create(new Array(howMany).fill(null).map(_=>({
        rol,
        firstName:faker.name.firstName(),
        email:faker.internet.email(),
        letter:faker.lorem.paragraph(),
        owner: admin.id,
      })))
      .then((guest) => console.info(`${guest.length} new guest added to the database`))
      .catch(error => console.error('🙅🏻‍♂️', error))
      .then(() => mongoose.connection.close());
    })
    .catch(error => console.error('👮🏻‍♂️', error))
}