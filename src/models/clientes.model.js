import mongoose from 'mongoose'
const clientesSchema = new mongoose.Schema({
    nombre : String,
    apellido: String,
    empresa: String,
    // emails: Array,
    email: String,
    edad: Number,
    tipo: String,
    pedidos: Array 
})
const Clientes = mongoose.model('clientes', clientesSchema)
export {Clientes}