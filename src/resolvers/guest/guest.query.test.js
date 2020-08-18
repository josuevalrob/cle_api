import request from 'supertest';
import app from '../../App'
import {checkFields} from '../../tests/utils'
import {stopDatabase} from '../../configs/bd.config';
import {GuestInput} from './guest.resolver';

afterAll(async () => {
  await stopDatabase();
});

test("fetch all Guests", async (done) => {
  request(app)
    .post("/graphql")
    .send({query: `{ getGuests { ${GuestInput.join(' ')} } }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {getGuests} = data;
      expect(getGuests).toBeInstanceOf(Array);
      getGuests.map(user => GuestInput.map(checkFields(user)))
      done();
    });
});