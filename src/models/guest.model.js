import mongoose from 'mongoose'
const clientesSchema = new mongoose.Schema({
    name : String,
    apellido: String,
    email: String,
    tipo: String,
    pedidos: Array 
})
const Clientes = mongoose.model('clientes', clientesSchema)
export {Clientes}