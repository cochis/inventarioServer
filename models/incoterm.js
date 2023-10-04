const { Schema, model } = require('mongoose')
const IncotermSchema = Schema({
 
   
  nombre: {
    type: String,
    required: true,
  },
   
  descripcion: {
    type: String,
    required: true,
  },
   
  clave: {
    type: String,
    required: true,
  },
    img: {
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

IncotermSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Incoterm', IncotermSchema)
