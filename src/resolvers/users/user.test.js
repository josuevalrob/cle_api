import request from 'supertest';
import app from '../../App'
import {stopDatabase} from '../../configs/bd.config';

afterAll(async () => {
  await stopDatabase();
});

test("fetch all the users - getUsers", async (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: "{ getUsers{ firstName } }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body}) => {
      if (err) return done(err);
      expect(body).toBeInstanceOf(Object);
      expect(body.data.getUsers.length).toEqual(12);
      done();
    });
});