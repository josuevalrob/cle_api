import request from 'supertest';
import app from '../../App'
import {adminLogin, checkCamping} from '../../tests/utils'
import {stopDatabase} from '../../configs/bd.config';
import {getCampingInput} from './camping.resolver';

afterAll(async () => {
  await stopDatabase();
});

test("fetch all Guests from all turnos", async (done) => {
  const agent = request.agent(app);
  await adminLogin(agent);
  agent.post("/graphql").send({
    query: `{ getTurnos { id } }` //* return all id from all turnos
  }).set("Accept", "application/json")
    .expect(200)
    .end((err, {body:{data:{getTurnos}}}) => {
      if (err) return done(err);
      getTurnos.map(({id}) => {
        agent.post("/graphql").send({
          //* get all campings from that turno
          query: `{
            getCampings(input:{ turno: "${id}" }) {
              ${getCampingInput()}
            }
          }`
        }).set("Accept", "application/json")
          .expect(200)
          .end((err, {body:{data, errors}}) => {
            if (err || !!errors) {
              console.log(errors);
              return done();
            };
            // * TESTS:
            expect(data).toBeInstanceOf(Object);
            const {getCampings} = data;
            expect(getCampings).toBeInstanceOf(Array);
            getCampings
              .map(checkCamping(id))  // Check all campings
              .map(camping => {       // Check single camping
                agent.post("/graphql").send({
                  //* get all campings from that turno
                  query: `{
                    getCamping( id: "${camping.id}" ) {
                      ${getCampingInput()}
                    }
                  }`
                }).set("Accept", "application/json")
                  .expect(200)
                  .end((err, {body:{data, errors}}) => {
                    if (err || !!errors) {
                      console.log(errors);
                      return done();
                    };
                    expect(data).toBeInstanceOf(Object);
                    const {getCamping} = data;
                    expect(getCamping).toBeInstanceOf(Object);
                    checkCamping(id)(getCamping)
                    done();
                  })
              });
          });
      })
    });
});