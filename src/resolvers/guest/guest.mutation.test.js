import request from 'supertest';
import faker from 'faker';
import app from '../../App'
import {testGuest, adminLogin} from '../../tests/utils';
import {stopDatabase} from '../../configs/bd.config';
import {GuestInput, getGuestInputs} from './guest.resolver';

afterAll(async () => {
  await stopDatabase();
});
const getOneGuestQuery = id => ({ query: ` {
  getGuests(input: {owner:"${id}"} limit:1){ email id }
}`})
//* createGuest
describe('Guest Workflow', () => {
  const email = faker.internet.email();

  test("Get all guest", async (done) => {
    const agent = request.agent(app);
    const admin = await adminLogin(agent);
    agent
      .post("/graphql")
      .send({
        query: `mutation {
          createGuest(input: {
            firstName:"${faker.name.firstName()}",
            email:"${email}",
            letter:"${faker.lorem.paragraph()}",
            owner: "${admin.id}"
          }) {
            ${getGuestInputs()}
          }
        }`
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, {body:{data, errors}}) => {
        if (err) return done(err);
        expect(data).toBeInstanceOf(Object);
        const {createGuest} = data;
        testGuest(createGuest);
        done();
      })
  })

//* updateGuest
  test("Filter by id and Update Guest", async (done) => {
    const newName = faker.name.firstName();
    const agent = request.agent(app);
    const admin = await adminLogin(agent);
    agent
      .post("/graphql")
      .send(getOneGuestQuery(admin.id))
      .end((err, {body:{data, errors}}) => {
        if (err) return done(err);
        const {getGuests} = data;

        agent
          .post("/graphql")
          .send({
            query: `mutation {
              updateGuest(input: {
                id: "${getGuests[0].id}"
                email: "${getGuests[0].email}"
                firstName:"${newName}"
              }){
                ${getGuestInputs()}
              }
            }`
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, {body:{data, errors}}) => {
            console.log(errors)  
            if (err) return done(err);
              expect(data).toBeInstanceOf(Object);
              const {updateGuest} = data;
              expect(updateGuest.firstName).toBe(newName);
              testGuest(updateGuest);
              done();
          })
      })
  })

  //* updateGuestStatus
  test("Update guest status", async (done) => {
    const agent = request.agent(app);
    const admin = await adminLogin(agent);
    agent
      .post("/graphql")
      .send(getOneGuestQuery(admin.id))
      .end((err, {body:{data, errors}}) => {
        if (err) return done(err);
        const {getGuests} = data;
        agent
          .post("/graphql")
          .send({
            query: `mutation{
              updateGuestStatus(
                status: ACCEPTED,
                email: "${getGuests[0].email}"
              ){
                ${getGuestInputs()}
              }
            }`
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, {body:{data, errors}}) => {
              console.log(errors)
              if (err) return done(err);
              expect(data).toBeInstanceOf(Object);
              const {updateGuestStatus} = data;
              testGuest(updateGuestStatus);
              done();
          })
      })
  })

// //* deleteGuest
// test("Get all guest", async (done) => {
//   const agent = request.agent(app);
//   await adminLogin(agent);
//   agent
//     .post("/graphql")
//     .send({
//       query: `{ dmutation eleteGuest(){
//         ${getGuestInputs()}
//       }}`
//     })
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .end((err, {body:{data}}) => {
//       if (err) return done(err);
//     })
// })

// //* sendGuest
// test("Get all guest", async (done) => {
//   const agent = request.agent(app);
//   await adminLogin(agent);
//   agent
//     .post("/graphql")
//     .send({
//       query: `{ smutation endGuest(){
//         ${getGuestInputs()}
//       }}`
//     })
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .end((err, {body:{data}}) => {
        // if (err) return done(err);
        // expect(data).toBeInstanceOf(Object);
        // const {getGuest} = data;
        // testGuest(getGuest);
        // done();
//     })
// })

// //* signupGuest
// test("Get all guest", async (done) => {
//   const agent = request.agent(app);
//   await adminLogin(agent);
//   agent
//     .post("/graphql")
//     .send({
//       query: `{ smutation ignupGuest(){
//         ${getGuestInputs()}
//       }}`
//     })
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .end((err, {body:{data}}) => {
//       if (err) return done(err);
//     })
// })
})
