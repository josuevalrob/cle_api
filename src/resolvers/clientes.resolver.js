import {Clientes} from '../models/clientes.model'
import User from '../models/user.model'
export const resolvers = {
    Query: {
        getClientes : (root, {limit, offset}) =>
            Clientes.find({}).limit(limit).skip(offset),
        getCliente : (root, {id}) => 
            new Promise ((resolve, rejects) =>
                Clientes.findById(
                    id,
                    (error, cliente) => error //callback
                        ? rejects(error)
                        : resolve(cliente)
                )
            ),
    }, 
    Mutation: {
        createUser: async(root, {name, email, password}) =>{
            const newUser = await User({
                email,
                password,
                name
            })

            console.log(newUser)
        },
        crearCliente : (root, {input}) => {
            const newClient = new Clientes({
                nombre : input.nombre,
                apellido: input.apellido,
                empresa: input.empresa,
                // emails: input.emails,
                email: input.email,
                edad: input.edad,
                tipo: input.tipo,
                pedidos: input.pedidos
            })
            newClient.id = newClient._id
            console.log('📩', newClient)

            return new Promise (( resolve, reject ) => {
                return newClient.save(err => {
                    
                    if(err) reject(err)
                    else resolve(newClient)
                })
            })
        },
        actualizarCliente : (root, {input}) => {
            console.log('😎 ',input)
            return new Promise ((resolve, object) =>
                Clientes.findOneAndUpdate(
                    {_id : input.id} ,
                    input, // new data! 
                    {new:true, useFindAndModify:false}, //si el registro no existe, crea uno nuevo
                    (error, cliente) => error //callback
                        ? rejects(error)
                        : (()=>{
                            console.log('🏠', cliente)
                            resolve(cliente)
                        })()
                )
            )
        },
        eliminarCliente: (root, {id}) => {
            console.log('💀 ',id)
            return new Promise ((resolve, object) =>
                Clientes.findOneAndRemove(
                    {_id : id} ,
                    (error, cliente) => error //callback
                        ? rejects(error)
                        : resolve("Se elimino correctamente")
                )
            )
        }
    }
}