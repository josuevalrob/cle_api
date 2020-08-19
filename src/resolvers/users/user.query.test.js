import request from 'supertest';
import app from '../../App'
import {stopDatabase} from '../../configs/bd.config';
import {UserFields, getUserFields} from './user.resolver';
import {checkFields} from './../../tests/utils'


afterAll(async () => {
  await stopDatabase();
});
// * getUser
test("fetch all fields of first user", async (done) => {
  request(app)
    .post("/graphql")
    .send({
      // ! DO NOT USE STATIC VALUES!!
      query: `
        { getUser(id:"5e7a36631580870017b297ce") { ${getUserFields()} } }
      `,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {getUser} = data;
      expect(getUser).toBeInstanceOf(Object);
      UserFields.map(checkFields(getUser))
      done();
    });
});
// * getUsers
test("fetch all users array", async (done) => {
  request(app)
    .post("/graphql")
    .send({query: `{ getUsers { ${getUserFields()} } }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {getUsers} = data;
      expect(getUsers).toBeInstanceOf(Array);
      getUsers.map(user => UserFields.map(checkFields(user)))
      done();
    });
});
// * getUsers
test("fetch getUsers with filters, limitations and offseted", async (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: `{
        getUsers(input:{ rol:patron }, limit:1, offset:1) {
          ${getUserFields()}
        }
      }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);
      expect(data).toBeInstanceOf(Object);
      const {getUsers} = data;
      expect(getUsers).toBeInstanceOf(Array);
      expect(getUsers[0]).toHaveProperty('rol');
      getUsers.map(user => UserFields.map(checkFields(user)))
      expect(getUsers.length).toEqual(1);
      done();
    });
});
