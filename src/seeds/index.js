require('dotenv').config();
const what = process.env.npm_config_what // npm -what=users run seeds
const howMany = process.env.npm_config_many || 1
const id = process.env.npm_config_id
const rol = process.env.npm_config_rolex
//* Import or generate the data
import faker from 'faker'
import {sampleSize, sample} from 'lodash'
//* Import the model
import UsersModel from '../models/user.model'
import {GuestModel} from '../models/guest.model'
import TurnoModel from '../models/turno.model'
import CampingModel from '../models/camping.model'
//* require mongoose
const mongoose = require('mongoose');

//* Import Database connection
require('../configs/bd.config');
const emptyArray = n => callback => new Array(n).fill(null).map(callback)
const threeArray = emptyArray(3) //helper
const nArray = emptyArray(parseInt(howMany))
console.log(`ready to import ${howMany}(s) ${what} 📦 `)

//* Create model with data.
//? User:
if(what === 'users') {
  UsersModel.create(nArray(_ => ({
      rol, //patreon for not provided rol
      email: faker.internet.email(),
      password: "123",
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      Country: faker.address.country(),
      City: faker.address.city(),
      birth: faker.date.past(18),
      profilePhoto: faker.image.avatar()
  })))
  .then((users) => console.info(`${users.length} new users added to the database`))
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close());
}

if(what === 'guest') {
    createGuest(howMany).then(_=> mongoose.connection.close());
}

if(what === 'camping') {
  // create 5 campings in an specific turn.
  if(!id) throw new Error ('You need to tell me the turn id to reference')
  Promise.all([ UsersModel.findOne({rol:'admin'}), UsersModel.find({rol:'patron'}), TurnoModel.findById(id), createGuest(2)])
  .then(([admin, allUsers, turno, guests]) => {
    const users = sampleSize(allUsers, 2)
    const campingName = faker.name.firstName()
    CampingModel.create([...users, ...guests].map(doc => ({
      owner: admin.id,
      turno: id,
      ...(!!doc.owner ? {guest: doc.id} : {patreon: doc.id}),
      patreonEmail: doc.email,
      firstName: campingName,
      basicData: basicDataGenerator(campingName),
      contactData: basicDataGenerator(),
      transporte: datesGenerator(),
      scheduleFood: foodScheduleGenerator(turno.dates, foodOpt(turno.campingType)),
    })))
    .then((campings) => console.info(`${campings.length} new campings added to the turno ${turno.name}`))
    .catch(console.error)
    .then(() => mongoose.connection.close());
  })
  .catch(console.error)
}

if(what === 'turno') {
  UsersModel.find({rol:'admin'})
    .then(admins => { // [...]
      if(!admins || !admins.length) throw Error('You need at least one admin user for generate a turno')
      const availableCharges = faker.lorem.sentence().split(' ').filter(w => w.length >= 3)
      const foodLabel = storedLabels(threeArray(_ => faker.lorem.word()))
      const permLabel = storedLabels(threeArray(_ => faker.lorem.word()))
      console.log('🏕')
      TurnoModel.create({
        owner: admins[0].id,
        name: faker.lorem.words(),
        description: shorten(faker.lorem.paragraph(1), 240),
        availableCharges,
        nightPrice: faker.commerce.price(10.00,25.00,2),
        team: admins
                .slice(1, availableCharges.length)
                .map(({id}, i) => ({
                  user: id,
                  charge: availableCharges[i]
                })),
        dates: datesGenerator(),
        campingType: [{name: "Monitor"}, {name: 'Acampado'}].map(obj => ({
          ...obj,
          foodOptions: threeArray(foodLabel),
          permissions: threeArray(permLabel)
        })),
      })
      .then((turno) => console.info(`${turno.name} turno added to the database`))
      .catch(error => console.error('🙅🏻‍♂️', error))
      .then(() => mongoose.connection.close());
    })
    .catch(error => console.error('👮🏻‍♂️', error))
}

const storedLabels = labels => (...args) => ({ // [...] => .map(fn)
  label: labels[args[1]], //get the n element from the labels array
  status:faker.random.boolean(),
  price:faker.commerce.price(3.00,10.00,2),
})

function createGuest(n) {
  return new Promise((resolve, reject) => {
    UsersModel.findOne({rol:'admin'}) //this should be configured by params
    .then(admin => {
      if(!admin) throw Error('You need an admin user for generate guest')
      GuestModel.create(emptyArray(n)(_=>({
        firstName:faker.name.firstName(),
        email:faker.internet.email(),
        letter:faker.lorem.paragraph(),
        owner: admin.id,
      })))
      .then((guest) => {
        console.info(`${guest.length} new guest 📮 added to the database`)
        resolve(guest)
      })
      .catch(reject)
    })
    .catch(reject)
  })
}

const split = sentence => sentence.split(' ').filter(w => w.length >= 3)

function basicDataGenerator(name){
  return {
    firstName:name || faker.name.firstName(),
    lastName:faker.name.lastName(),
    birth:faker.date.past(10),
    profilePhoto:faker.internet.avatar(),
    alergies:split(faker.lorem.sentence()),
    medication:split(faker.lorem.sentence()),
    curso: faker.lorem.word() + faker.lorem.word(),
  }
}
function datesGenerator(){
  return [
    {value: faker.date.between('2020-06-01', '2020-06-15'), label: 'inicio'},
    {value: faker.date.between('2020-06-15', '2020-07-01'), label: 'fin'}
  ]
}

function foodScheduleGenerator(dates, foodOptions) {
  const [inicio, fin] = dates // [{...}, {...}]
  // To calculate the time difference of two dates
  const Difference_In_Time = fin.value - inicio.value;
  // To calculate the no. of days between two dates
  const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  const foodLabels = [...foodOptions , ...emptyArray(3)(_=>faker.lorem.word())]
  const mutableDate = new Date(inicio.value) // starting date.
  return emptyArray(Difference_In_Days)((...args) => ({
    value: sample(foodLabels),
    day:  mutableDate.setDate(mutableDate.getDate() + 1) //args[1] //* inicio will increase in every loop
  }))
}

function foodOpt(arr) {
  return arr[0].foodOptions.map(({label}) => label)
}

function shorten(text,max) {
  return text && text.length > max ? text.slice(0,max).split(' ').slice(0, -1).join(' ') : text
}