import request from 'supertest';
import app from '../../App'
import {checkFields} from '../../tests/utils'
import {stopDatabase} from '../../configs/bd.config';
import {CampingTypes} from './camping.resolver';
import {TurnoInput} from '../turno/turno.resolver';


afterAll(async () => {
  await stopDatabase();
});

test("fetch all Guests from all turnos", async (done) => {
  const agent = request(app);
  agent.post("/graphql").send({
    query: `{ getTurnos { id } }` //* return all id from all turnos
  }).set("Accept", "application/json")
    .end((err, {body:{data:{getTurnos}}}) => {
      if (err) return done(err);

      getTurnos.map(({id}) => {
        console.log(id)
        agent.post("/graphql").query({
          query: `{ //* Return all the fields from that specific turno id
            getCampings (input:{ turno: "${id}" }) {
              id
            }
          }`
        }).set('Content-Type', "application/json")
          .end((err, response) => {
            if (err) return done(err);
            // * TESTS:
            console.log(response.error)
            // expect(data).toBeInstanceOf(Object);
            // const {getCampings} = data;
            // expect(getCampings).toBeInstanceOf(Object);
            // CampingTypes.map(checkFields(getCampings))
            done();
          });
      })
    });
});