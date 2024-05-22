const { Schema, model } = require('mongoose')
const StockSchema = Schema({
  tipoStock: {
    type: Schema.Types.ObjectId,
    ref: "TipoStock",
    required: true
  },
  clave: {
    type: String,
  
  },
  nip: {
    type: String,
  
  },
  modelo: {
    type: String,
    required: true,
  },
 
  serie: {
    type: String,
  
  },
  img: {
    type: String,
    default:null
  },
  status: {
    type: String,
    default:null
  },
  asignado: {
    type: Boolean,
    default:false
  },
  usuarioAsignado: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
   default:null
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

StockSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Stock', StockSchema)
