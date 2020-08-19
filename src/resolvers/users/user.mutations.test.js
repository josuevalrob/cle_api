import request from 'supertest';
import faker from 'faker'
import app from '../../App'
import {stopDatabase} from '../../configs/bd.config';
import {UserFields, getUserFields} from './user.resolver';
import {checkFields} from './user.query.test';
import User from '../../models/user.model';

const email = faker.internet.email();
const name = faker.name.firstName();
let userId = null;
const password = "123"

afterAll(async () => {
  await stopDatabase();
});

// * signup
test("Create user only once!", async (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        signup(input: {
          email: "${email}"
          firstName: "${name}"
          password: "${password}",
        }) { user { ${getUserFields()} } }
      }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {signup:user} = data;
      userId = user.id;
      expect(user).toBeInstanceOf(Object);
      expect(user.email).toBe(email);
      expect(user.firstName).toBe(name);
      expect(user.rol).toBe("patron");
      UserFields.map(checkFields(user));
      // ! test second login
      done();
    });
});
// * login
test("Login with the created user!", async (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        login( email: "${email}" password: "${password}") {
          user { ${getUserFields()} }
        }
      }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {signup:user} = data;
      expect(user).toBeInstanceOf(Object);
      expect(user.email).toBe(email);
      expect(user.firstName).toBe(name);
      expect(user.rol).toBe("patron");
      UserFields.map(checkFields(user));
      done();
    });
});

// * logout
test("Logout return null", async (done) => {
  request(app)
    .post("/graphql")
    .send({ query: ` mutation { logout  }` })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {logout} = data;
      expect(logout).toBe(null);
      done();
    });
});

// * updateUser
test("Update user name", async (done) => {
  const newName = faker.name.firstName();
  request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        updateUser(input: {
          firstName: "${newName}"
        }) { user { ${getUserFields()} } }
      }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {signup:user} = data;
      expect(user).toBeInstanceOf(Object);
      expect(user.email).toBe(email);
      expect(user.firstName).toBe(newName);
      expect(user.rol).toBe("patron");
      UserFields.map(checkFields(user));
      // ! test second login
      done();
    });
});
// * DeleteUser
test("Delete User", async (done) => {
  const newName = faker.name.firstName();
  request(app)
    .post("/graphql")
    .send({
      query: `
      mutation {
        updateUser(id:${userId}") { user { ${getUserFields()} } }
      }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {signup:user} = data;
      expect(user).toBeInstanceOf(Object);
      expect(user.email).toBe(email);
      expect(user.firstName).toBe(newName);
      expect(user.rol).toBe("patron");
      UserFields.map(checkFields(user));
      // ! test second login
      done();
    });
});