const { Schema, model } = require('mongoose')
const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellidoPaterno: {
    type: String,
    required: true,
  },
  apellidoMaterno: {
    type: String,
  },
  usuario: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
  },
  role:[ {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true
  }],
   puesto: {
    type: Schema.Types.ObjectId,
    ref: "Puesto",
    default: null

  },
   departamento: {
    type: Schema.Types.ObjectId,
    ref: "Departamento",
    default: null

  },
   usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    default: null

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

UsuarioSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Usuario', UsuarioSchema)
