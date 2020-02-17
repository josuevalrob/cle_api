import express from 'express'
import graphqlHTTP from 'express-graphql';
import schema from './schema'
const app = express()

app.get('/', (req, res) => {
    res.send('hello world')
})

// resolver
const root = {hola: ()=> 'hello graphql'};

app.use('/graphql', graphqlHTTP({
    //schema to use on that url
    schema, 
    // resolver
    rootValue : root,
    //graphical. 
    graphiql : true
}))

app.listen(8000, () => console.log('server on port 8000 ready'))