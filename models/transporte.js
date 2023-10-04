const { Schema, model } = require('mongoose')
const TransporteSchema = Schema({
   type: {
    type: Boolean,
    required: true,
  },
  carga: {
    type: Schema.Types.ObjectId,
    ref: "Carga",
  },
  tipoCarga: {
    type: Schema.Types.ObjectId,
    ref: "TipoCarga",
  },

  cantidadMinima: {
    type: Number,
    
  },
  cantidadMaxima: {
    type: Number,
    
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

TransporteSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Transporte', TransporteSchema)
