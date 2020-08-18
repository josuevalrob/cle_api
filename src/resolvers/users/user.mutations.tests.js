import request from 'supertest';
import faker from 'faker'
import app from '../../App'
import {stopDatabase} from '../../configs/bd.config';
import {UserFields, getUserFields} from './user.resolver';
import {checkFields} from './user.query.test';
import User from '../../models/user.model';

afterAll(async () => {
  await stopDatabase();
});

// * signup
test("Create user only once!", async (done) => {
  const email = faker.internet.email();
  request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        signup(input: {
          email: ${email}
          password: "123",
          firstName: "josue"
        }) { user { email id } }
      }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, response) => {
      if (err) return done(err);
      // expect(data).toBeInstanceOf(Object);
      // const {signup} = data;
      // expect(signup).toBeInstanceOf(Object);
      // console.log(signup)
      // UserFields.map(checkFields(signup))
      done();
    });
});
// * login
// * logout
// * updateUser
// * DeleteUser