import request from 'supertest';
import faker from 'faker'
import app from '../../App'
import {stopDatabase} from '../../configs/bd.config';
import {UserFields, getUserFields} from './user.resolver';
import {checkFields} from './../../tests/utils'
import User from '../../models/user.model';
import {NO_PERMISSIONS_DELETE, DELETED_BUT_NOT_GUEST_UPDATED, ALREADY_REGISTER} from './user.mutations'

const email = faker.internet.email();
const name = faker.name.firstName();
const loginQuery = (loginEmail, password = '123') => `
login( email: "${loginEmail}" password: "${password}") {
  user { ${getUserFields()} }
}`
afterAll(async () => {
  await User.findOneAndDelete({email}).exec();//should be deleted by the test
  await stopDatabase();
});

// * signup
test("Create user only once!", async (done) => {
  const agent = request(app);
  agent
    .post("/graphql")
    .send({
      query: `
      mutation {
        signup(input: {
          email: "${email}"
          firstName: "${name}"
          password: "123",
        }) { user { ${getUserFields()} } }
      }`,
    })
    .set("Accept", "application/json")
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {signup:{user}} = data;
      expect(user).toBeInstanceOf(Object);
      expect(user.email).toBe(email);
      expect(user.firstName).toBe(name);
      expect(user.rol).toBe("patron");
      UserFields.map(checkFields(user));
      // * Second try, same email
      agent
        .post("/graphql")
        .send({
          query: `
          mutation {
            signup(input: {
              email: "${email}"
              firstName: "${name}"
              password: "123",
            }) { user { ${getUserFields()} } }
          }`,
        })
        .set("Accept", "application/json")
        .expect(200)
        .end((err, {body:{data, errors}}) => {
          expect(data).toBeInstanceOf(Object);
          expect(data.signup).toBe(null);
          expect(errors).toBeInstanceOf(Array);
          expect(errors[0].message).toBe(ALREADY_REGISTER)
          done();
        })
    });
});
// * login
test("Login with the created user!", async (done) => {
  request(app)
    .post("/graphql")
    .send({ query: ` mutation { ${loginQuery(email)} }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {login:{user}} = data;
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
  const userTest = await User.findOne({email}).exec()
  if(!userTest) done();
  const newName = faker.name.firstName();
  const updateFirstName = `
    updateUser(input: {
      firstName: "${newName}"
      id: "${userTest._id}"
    }) { ${getUserFields()} }
  `
  const agent = request(app);
  agent
    .post("/graphql")
    .send({ query: `mutation { ${updateFirstName} }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data, errors}}) => {
      if (err) return done(err);
      expect(data).toHaveProperty('updateUser');
      expect(data.updateUser).toBeNull();
      expect(errors).toBeInstanceOf(Array);
      expect(errors[0].message).toBe("Unauthenticated");
      // * Login for add the user in the context
      agent
        .post("/graphql")
        .send({ query: ` mutation {
          ${loginQuery(email)}
          ${updateFirstName}
        }`})
        .set("Accept", "application/json")
        .end((err, {body:{data, errors}}) => {
          if (err) return done(err);
          const {updateUser} = data;
          expect(updateUser).toBeInstanceOf(Object);
          expect(updateUser.email).toBe(email);
          expect(updateUser.firstName).toBe(newName);
          expect(updateUser.rol).toBe("patron");
          UserFields.map(checkFields(updateUser));
          done();
        })
    });
});
// * DeleteUser
test("Delete User with no permission", async (done) => {
  const userTest = await User.findOne({email}).exec();
  const userAdmin = await User.findOne({rol:"admin"}).exec();
  if(!userTest || !userTest._id) done();
  const deleteQuery = `deleteUser(id:"${userTest._id}")`;
  const agent = request(app);
  agent
    .post("/graphql")
    .send({ query: `mutation { ${deleteQuery} }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {deleteUser} = data;
      expect(deleteUser).toBe(NO_PERMISSIONS_DELETE);
      agent
        .post("/graphql")
        .send({ query: `mutation {
          ${loginQuery(userAdmin.email)}
          ${deleteQuery}
        }`})
        .end((err,  {body:{data, errors}}) => {
          if (err) return done(err);
          expect(data).toBeInstanceOf(Object);
          const {deleteUser} = data;
          expect(deleteUser).toBe(DELETED_BUT_NOT_GUEST_UPDATED);
          done();
        })
    });
});