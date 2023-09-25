const { Schema, model } = require('mongoose')
const AsignacionSchema = Schema({
  stock: {
    type: Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  estadoEntrega: {
    type: String,
    required: true,
  },
  imgEntrega: {
    type: String,
    required: true,
  },
  descripcionEntrega: {
    type: String,
    required: true,
  },
  aceptacion: {
    type:Boolean,
    default:false
  },
  
  quienEntrego: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  estadoRegreso: {
    type: String,
    required: true,
  },
  imgRegreso: {
    type: String,
    required: true,
  },
  descripcionRegreso: {
    type: String,
    required: true,
  },
  aceptacionRegreso: {
    type:String,
    required: true
  },
  quienRecibio: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
 
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
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

AsignacionSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Asignacion', AsignacionSchema)
