require('dotenv').config();
const what = process.env.npm_config_what // npm -what=users run seeds
const howMany = process.env.npm_config_many || 1
const rol = process.env.npm_config_rol
//* Import or generate the data
import faker from 'faker'
//* Import the model
import UsersModel from '../models/user.model'
import {GuestModel} from '../models/guest.model'
import TurnoModel from '../models/turno.model';
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
      "birth": faker.date.past(18),
      profilePhoto: faker.image.avatar()
  })))
  .then((users) => console.info(`${users.length} new users added to the database`))
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close());
}

if(what === 'guest') {
  UsersModel.findOne({rol:'admin'}) //this should be configured by params
    .then(admin => {
      if(!admin) throw Error('You need admin user for generate guest')
      GuestModel.create(new Array(howMany).fill(null).map(_=>({
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

if(what === 'turno') {
  UsersModel.find({rol:'admin'})
    .then(admins => { // [...]
      if(!admins || !admins.length) throw Error('You need at least one admin user for generate a turno')
      const availableCharges = faker.lorem.sentence().split(' ').filter(w => w.length >= 3)
      const foodLabel = storedLabel(faker.lorem.word())
      const permLabel = storedLabel(faker.lorem.word())
      TurnoModel.create({
        owner: admins[0].id,
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(1),
        availableCharges,
        nightPrice: faker.commerce.price(10.00,25.00,2),
        team: admins
                .slice(1, availableCharges.length)
                .map(({id}, i) => ({
                  user: id,
                  charge: availableCharges[i]
                })),
        dates: [
          {value: faker.date.between('2020-06-01', '2020-06-15'), label: 'inicio'},
          {value: faker.date.between('2020-06-15', '2020-07-01'), label: 'fin'}
        ],
        campingType: [
          {
            name: "Monitor",
            foodOptions: foodLabelSchema(foodLabel),
            permissions: foodLabelSchema(permLabel)
          },
          {
            name: 'Acampado',
            foodOptions: foodLabelSchema(foodLabel),
            permissions: foodLabelSchema(permLabel)
          }
        ],
      })
      .then((turno) => console.info(`${turno.name} turno added to the database`))
      .catch(error => console.error('🙅🏻‍♂️', error))
      .then(() => mongoose.connection.close());
    })
    .catch(error => console.error('👮🏻‍♂️', error))
}


const foodLabelSchema = callback => new Array(3).fill(null).map(callback)

const storedLabel = label => (...args) => {
  console.log(args[1])
  return ({
  label,
  status:faker.random.boolean(),
  price:faker.commerce.price(3.00,10.00,2),
})}