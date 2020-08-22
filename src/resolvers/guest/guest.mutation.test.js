import request from 'supertest';
import faker from 'faker';
import app from '../../App';

import {GuestModel} from './../../models/guest.model'
import CampingModel from './../../models/camping.model'

import {testGuest, adminLogin} from '../../tests/utils';
import {stopDatabase} from '../../configs/bd.config';
import {GUEST_NOT_SEND, getGuestInputs} from './guest.resolver';
import {SUCCESS_DELETED, UserFields, getUserFields} from '../users/user.resolver';

afterAll(async () => {
  await stopDatabase();
});
const getOneGuestQuery = (id = false, status = 'STANDBY') => ({ query: ` {
  getGuests(input: {
    status: ${status}
    ${ !!id ? `owner:"${id}"` : ''}
  } limit:1){ ${getGuestInputs()} }
}`})
//* createGuest
const email = faker.internet.email();

test("Create a guest", async (done) => {
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
            if (err) return done(err);
            expect(data).toBeInstanceOf(Object);
            const {updateGuestStatus} = data;
            expect(updateGuestStatus.status).toBe("ACCEPTED")
            testGuest(updateGuestStatus);
            done();
        })
    })
})

//* deleteGuest
test("Delete a Guest", async (done) => {
  const agent = request.agent(app);
  const admin = await adminLogin(agent);
  agent
    .post("/graphql")
    .send(getOneGuestQuery(admin.id))
    .end((err, {body:{data, errors}}) => {
      if (err || !!errors) { 
        console.log(errors);
        return done();
      };
      const {getGuests} = data;
      agent
      .post("/graphql")
      .send({
        query: `mutation { deleteGuest(id:"${getGuests[0].id}") }`
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, {body:{data, errors}}) => {
        if (err || !!errors) { 
          console.log(errors);
          return done();
        };
        expect(data).toBeInstanceOf(Object);
        expect(data.deleteGuest).toBeInstanceOf(SUCCESS_DELETED);
        done()
      })
  })
})

//* sendGuest
test("Send Guest", async (done) => {
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
            sendGuest(
              id: "${getGuests[0].id}"
              letter: "Testing message..."
            ){
              ${getGuestInputs()}
            }}`
          })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, {body:{data, errors}}) => {
          if (err) return done(err);
          expect(data).toBeInstanceOf(Object);
          const {sendGuest} = data;
          expect(sendGuest.status).toBe("SEND")
          expect(sendGuest.status).toBe("Testing message...")
          testGuest(sendGuest);
          done();
        })
  })
})

//* signupGuest
test("SignUp throw error for not send guest", async (done) => {
  const agent = request.agent(app);
  await adminLogin(agent);
  agent
    .post("/graphql")
    .send(getOneGuestQuery())
    .end((err, {body:{data, errors}}) => {
      if (err || !!errors) { 
        console.log(errors);
        return done();
      };
      const {getGuests:[guest]} = data;
      const {id, email, firstName, status} = guest;
      console.log(guest)
      agent
        .post("/graphql")
        .send({query: `mutation {
          signupGuest (input:{
            email: "${email}"
            firstName: "${firstName}"
            password: "123",
          } key:"${id}") {
            user { ${getUserFields()} }
          }
        }`})
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, {body:{data, errors}}) => {
          if (err) { 
            return done();
          };
          console.log(errors);
          expect(errors[0].message).toBe(GUEST_NOT_SEND);
          done();
        })
  })
})

// test("SignUp For previusly sended guest", async (done) => {
//   const agent = request.agent(app);
//   await adminLogin(agent);
//   agent
//     .post("/graphql")
//     .send(getOneGuestQuery(false, 'SEND'))
//     .end((err, {body:{data, errors}}) => {
//       if (err || !!errors) {
//         console.log(errors);
//         return done();
//       };
//       const {getGuests:[guest]} = data;
//       console.log(data)
      // const {id, email, firstName, status} = guest;
      // agent
      //   .post("/graphql")
      //   .send({query: `mutation {
      //     signupGuest (input:{
      //       email: "${email}"
      //       firstName: "${firstName}"
      //       password: "123",
      //     } key:"${id}") {
      //       user { ${getUserFields()} }
      //     }
      //   }`})
      //   .expect("Content-Type", /json/)
      //   .expect(200)
      //   .end(async (err, {body:{data, errors}}) => {
      //     if (err || !!errors) { 
      //       console.log(errors);
      //       return done();
      //     };
      //     expect(data).toBeInstanceOf(Object);
      //     const {signupGuest:{user}} = data;
      //     UserFields.map(checkFields(user));
      //     const updateCamping = await CampingModel
      //                             .find({patreonEmail:user.email})
      //                             .populate(turno)
      //                             .populate('guest')
      //                             .populate('patreon')
      //                             .exec()
      //     console.log(updateCamping);
//           done();
        // })
//   })
// })