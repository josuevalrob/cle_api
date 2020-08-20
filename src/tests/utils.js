import User from '../models/user.model';
import {getUserFields, UserFields} from './../resolvers/users/user.resolver';
import {GuestInput} from './../resolvers/guest/guest.resolver';

export const checkFields = data => field => expect(data).toHaveProperty(field)

export const loginQuery = (loginEmail, password = '123') => `
login( email: "${loginEmail}" password: "${password}") {
  user { ${getUserFields()} }
}`
// ! this should be a curry
export const adminLogin = async (agent) => {
  const userAdmin = await User.findOne({rol:"admin"}).exec();
  if(!userAdmin) return new Promise.reject('Admin not found')
  return testUserLogin(agent, userAdmin.email)
}
// ! this should be a curry
export const patreonLogin = async (agent) => {
  const userAdmin = await User.findOne({rol:"patron"}).exec();
  if(!userAdmin) return new Promise.reject('patron not found')
  return testUserLogin(agent, userAdmin.email)
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
  UserFields.map(checkFields(guest.owner));
  return guest;
}
