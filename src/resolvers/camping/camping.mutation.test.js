import request from 'supertest';
import app from '../../App'
import {patreonLogin, checkCamping} from '../../tests/utils'
import {stopDatabase} from '../../configs/bd.config';
import {getCampingInput} from './camping.resolver';

afterAll(async () => {
  await stopDatabase();
});


// createCamping
test("Create Camping", async (done)=>{
  const agent = request.agent(app);
  const patreon = await patreonLogin(agent);
  agent.post("/graphql").send({
    query: `{ getTurnos(limit:1) { id } }` //* return all id from all turnos
  }).set("Accept", "application/json")
    .expect(200)
    .end((err, {body:{data:{getTurnos}, errors}}) => {
      if (err || !!errors) {
        console.log(errors);
        return done();
      };
      //pick the first Turno
      const [{id}] = getTurnos;
      console.log(id)
      //Create an camping with the current logged patreon
      agent.post("/graphql").send({
        query:` mutation {
          createCamping(input:{
            turno: "${id}"
            patreonEmail: "${patreon.email}"
            firstName: "Test Name"
          }) {
            ${getCampingInput()}
          }
        }`
      }).set("Accept", "application/json")
      .expect(200)
      .end((err, {body:{data, errors}}) => {
        if (err || errors ) {
          console.log(errors)
          done(err || errors)
        }
        expect(data).toBeInstanceOf(Object);
        const {createCamping} = data;
        expect(createCamping).toBeInstanceOf(Object);
        // checkCamping(id)(createCamping);
        done();
      })
    })
})

// updateCamping
// test("Update camping", async (done)=>{
//   const agent = request.agent(app);
//   const patreon = await patreonLogin(agent);
//   agent.post("/graphql").send({
//     query: `{ getTurnos(limit:1) { id } }` //* return all id from all turnos
//   }).set("Accept", "application/json")
//     .expect(200)
//     .end((err, {body:{data:{getTurnos}, errors}}) => {
//       if (err || !!errors) {
//         console.log(errors);
//         return done();
//       };
//       const [{id}] = getTurnos;

//       agent.post("/graphql").send({
//         query:`{
//           updateCamping(input:{
//             turno: "${id}"
//           }) {
//             ${getCampingInput()}
//           }
//         }`
//       }).set("Accept", "application/json")
//       .expect(200)
//       .end((err, {body:{data, errors}}) => {
//         if (err || errors ) {
//           console.log(errors)
//           done(err)
//         }
//         expect(data).toBeInstanceOf(Object);
//         const {updateCamping} = data;
//         expect(updateCamping).toBeInstanceOf(Object);
//         checkCamping(id)(updateCamping)
//       })
//     })
// })

// deleteCamping
// test("", async (done)=>{
//   const agent = request.agent(app);
//   await patreonLogin(agent);
//   agent.post("/graphql").send({
//     query:``
//   }).set("Accept", "application/json")
//     .expect(200)
//     .end((err, {body:{data, errors}}) => {
//       if (err || errors ) {
//         console.log(errors)
//         done(err)
//       }
//       checkCamping(id)(getCamping)
//     })

// })