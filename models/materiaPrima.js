const { Schema, model } = require('mongoose')
const MateriaPrimaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  clave: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  tipoMaterial: {
    type: Schema.Types.ObjectId,
    ref: "TipoMaterial",
  },
  unidadMedida: {
    type: Schema.Types.ObjectId,
    ref: "UnidadMedida",
  },
  precioStd: {
    type: Number,
    required: true,
  },
  moneda: {
    type: Schema.Types.ObjectId,
    ref: "Moneda",
  },
  variedad: {
    type: String,
    
  },
  area: {
    type: String,
    
  },
  tipo: {
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

MateriaPrimaSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('MateriaPrima', MateriaPrimaSchema)
