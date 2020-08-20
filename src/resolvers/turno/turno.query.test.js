import request from 'supertest';
import app from '../../App'
import {stopDatabase} from '../../configs/bd.config';
import {checkFields, adminLogin} from '../../tests/utils'
import {TurnoInput} from './turno.resolver';

afterAll(async () => {
  await stopDatabase();
});

test("fetch all Turnos", async (done) => {
  const agent = request.agent(app);
  await adminLogin(agent);
  agent
    .post("/graphql")
    .send({query: `{
      getTurnos {
        ${TurnoInput.join(' ')}
        owner { id }
        team {user {id}}
      }
    }`})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, {body:{data}}) => {
      if (err) return done(err);

      expect(data).toBeInstanceOf(Object);
      const {getTurnos} = data;
      expect(getTurnos).toBeInstanceOf(Array);

      getTurnos.map(turno => {
        TurnoInput.map(checkFields(turno)); //* check recieved fields

        Promise.all([
          agent.post("/graphql").set("Accept", "application/json").send({
            query: `{ getUser(id: "${turno.owner.id}") { id } }`,
          }),
          ...turno.team.map(member => 
            agent.post("/graphql").set("Accept", "application/json").send({
              query: `{ getUser(id: "${member.user.id}") { id } }`,
            }))
        ]).then(([owner, ...teamsMember]) => {

            const {body:{data}} = owner;
            expect(data).toBeInstanceOf(Object);
            expect(data.getUser.id).toBe(turno.owner.id);

            expect(teamsMember.length).toBe(turno.team.length)

            teamsMember
              .map(member => member.body.data.getUser)
              .map(member => expect(member).toHaveProperty("id"));

            done();
          })
          .catch(done)
      })
    });
});