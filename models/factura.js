const { Schema, model } = require('mongoose')
const tipoFactura = require('./tipoFactura')
const FacturaSchema = Schema({
 
   
  solicitudViaje: {
    type: Schema.Types.ObjectId,
    ref: "SolicitudViaje",
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
   
  descripcion: {
    type: String,
    required: true,
  },
  tipoFactura: {
    type: Schema.Types.ObjectId,
    ref: "Factura",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  moneda: {
    type: String,
    required: true,
  },
  currencyExchange: {
    type: Number,
    required: true,
  },
   
   
    file: {
    type: String,
 
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    
  },
 
    activated: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  lastEdited: {
    type: Number,
    required: true,
    default: Date.now(),
  },

})

FacturaSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Factura', FacturaSchema)
