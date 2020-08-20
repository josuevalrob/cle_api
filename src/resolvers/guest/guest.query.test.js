import request from 'supertest';
import app from '../../App'
import {testGuest, adminLogin} from '../../tests/utils';
import {stopDatabase} from '../../configs/bd.config';
import {GuestInput, getGuestInputs} from './guest.resolver';
import {UserFields} from '../users/user.resolver'


afterAll(async () => {
  await stopDatabase();
});
//* GetGuests
test("Get all guest", async (done) => {
  const agent = request.agent(app);
  await adminLogin(agent);
  agent
    .post("/graphql")
    .send({query: `{ getGuests(limit: 2, offset:1) { ${getGuestInputs()}} }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {getGuests} = data;
      expect(getGuests).toBeInstanceOf(Array);
      getGuests.map(testGuest)
      done();
    });
})
//* GetGuest
test("Get a guest", async (done) => {
  const agent = request.agent(app);
  await adminLogin(agent);
  agent
    .post("/graphql")
    .send({query: `{ getGuests(limit: 2, offset:1) { id } }`})
    .end((err, {body:{data:{getGuests}}}) => {
      if (err) return done(err);
      const [{id}] = getGuests;
      agent
        .post("/graphql")
        .send({query: `{ getGuest(id:"${id}") { ${getGuestInputs()} } }`})
        .end((err, {body:{data}}) => {
          if (err) return done(err);
          expect(data).toBeInstanceOf(Object);
          const {getGuest} = data;
          testGuest(getGuest);
          done();
        });
    });
})
//* get my guests
test("Get all guest", async (done) => {
  const agent = request.agent(app);
  const user = await adminLogin(agent);
  agent
    .post("/graphql")
    .send({query: `{ getMyGuests(limit: 1, offset:0) {
       ${getGuestInputs()}
      }
    }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {getMyGuests} = data;
      expect(getMyGuests).toBeInstanceOf(Array);
      getMyGuests
        .map(testGuest)
        .map(({owner}) => owner.id === user.id);
      done();
    });
})

