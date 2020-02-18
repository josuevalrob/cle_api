import express from 'express'
const router = express.Router();
import graphqlHTTP from 'express-graphql';
import schema from './../schema'

const root = {hola: ()=> 'hello graphql'};

router.use('/graphql', graphqlHTTP({
    //schema to use on that url
    schema, 
    // resolver
    rootValue : root,
    //graphical. 
    graphiql : true
}))

export default router