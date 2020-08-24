import User from '../models/user.model';
import {getUserFields, UserFields} from './../resolvers/users/user.resolver';
import {GuestInput} from './../resolvers/guest/guest.resolver';
import {isNil} from 'lodash';

export const checkFields = data => field => {
  return expect(data).toHaveProperty(field)
}

export const loginQuery = (loginEmail, password = '123') => `
login( email: "${loginEmail}" password: "${password}") {
  user { ${getUserFields()} }
}`

export const adminLogin = agent => randomLogin("patron")(agent);

export const patreonLogin = agent => randomLogin("patron")(agent)


export const randomLogin = (rol) => async (agent) => {
  try {
    const count = await  User.count({rol}).exec()
    const random = Math.floor(Math.random() * count)
    const user = await User.findOne({rol}).skip(random).exec();

    return testUserLogin(agent, user.email)
  } catch (error) {
    return new Error(`${rol} not found`)
  }
}


export const testUserLogin = (agent, email, done) => {
  return agent.post('/graphql').send({
    query: ` mutation { ${loginQuery(email)} }`
  }).then((data) => JSON.parse(data.text).data.login.user)
  .catch(done)
}

export const testGuest = (guest) => {
  expect(guest).toBeInstanceOf(Object);
  GuestInput.map(checkFields(guest));
  !isNil(guest.owner) && UserFields.map(checkFields(guest.owner));
  return guest;
}



export const checkCamping = (id) => (camping) => {
  const {turno, owner, patreon, guest} = camping
  expect(turno.id).toBe(id)
  UserFields.map(checkFields(owner));
  !isNil(patreon) && UserFields.map(checkFields(patreon));
  !isNil(guest) && testGuest(guest);
  return camping;
}
