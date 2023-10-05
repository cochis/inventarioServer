const { Schema, model } = require('mongoose')
const ProveedorSchema = Schema({
 
   
  tipoProveedor: {
    type: Schema.Types.ObjectId,
    ref: "TipoProveedor",
  },
  nombreEmpresa: {
    type: String,
 
  },
  nombreRepresentante: {
    type: String,
 
  },
   
  zonas:[{
    type: Schema.Types.ObjectId,
    ref: "Zona",
    
  }],
   
  productos:[{
    type: Schema.Types.ObjectId,
    ref: "Producto",
    
  }],
    telefono: {
    type: Number,
 
  },
    correo: {
    type: String,
 
  },
    incoterm: [{
      type: Schema.Types.ObjectId,
      ref: "Producto",
      
    }],
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

ProveedorSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Proveedor', ProveedorSchema)
