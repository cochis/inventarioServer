const { Schema, model } = require('mongoose')
const CompaniaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  clave: {
    type: String,
    required: true,
  },
  calle: {
    type: String,
    required: true,
  },
  ciudad: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  codigoPostal: {
    type: Number,
    required: true,
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

CompaniaSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Compania', CompaniaSchema)
