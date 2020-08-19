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
    .expect(200)
    .end((err, {body:{data:{getTurnos}}}) => {
      if (err) return done(err);

      getTurnos.map(({id}) => {
        agent.post("/graphql").send({
          //* get all campings from that turno
          query: `{
            getCampings(input:{
              turno: "${id}"
            }) {
              id
              turno { id }
              owner { id  }
              patreon { id }
              guest { id }
            }
          }`
        }).set("Accept", "application/json")
          .expect(200)
          .end((err, {body:{data}}) => {
            if (err) return done(err);
            // * TESTS:
            expect(data).toBeInstanceOf(Object);
            const {getCampings} = data;
            expect(getCampings).toBeInstanceOf(Array);
            getCampings.map(({turno}) => expect(turno.id).toBe(id));
            done();
          });
      })
    });
});