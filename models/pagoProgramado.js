const { Schema, model } = require('mongoose')
const PagoProgramadoSchema = Schema({
  consecutivo: {
    type: Number
  },
  urgente: {
    type: Boolean
  },
  subsidiaria: {
    type: Schema.Types.ObjectId,
    ref: "Subsidiaria",
    required: true,
  },
  tipoGasto: {
    type: Schema.Types.ObjectId,
    ref: "TipoGasto",
    required: true,
  },
  terminoPago: {
    type: Schema.Types.ObjectId,
    ref: "TerminoPago",
    required: true,
  },
  proveedor: {
    type: String 
  },

  proveedorLoop: {
    type: Schema.Types.ObjectId,
    ref: "ProveedorLoop",
    default:null
   
  },
  clienteLoop:{
    type: Schema.Types.ObjectId,
    ref: "ClienteLoop",
    default:null
  },
  impExpLoop: {
    type: String,
   
  },
  concepto: {
    type: String, 
  },
  conceptoLoop: {
    type: Schema.Types.ObjectId,
    ref: "ConceptoLoop",
    default:null
  },
  otroConcepto: {
    type: String, 
  },
  cantidad: {
    type: Number,
    required: true,
  },
  fechaSolicitud: {
    type: Number,
    required: true,
    default: Date.now(),
  },

  fechaPago: {
    type: Number,

  },
  pagado: {
    type: Boolean,
    default: false

  },

  fechaProgramada: {
    type: Number,

  },
  fechaVencimiento: {
    type: Number,

  },
  
  quote: {
    type: String,

  },
  aprobacion: {
    type: Boolean,
    default: false
  },
  tipoServicio: {
    type: String
  },
  observaciones: {
    type: String,

  },
  factura: {
    type: String,

  },
  tipoFactura: {
    type: String,

  },


  factura: {
    type: String,
  },
  tipoFactura: {
    type: String,
  },
  cotizacion: {
    type: String,
  },
  comprobante: {
    type: String,
  },
  cerrada: {
    type: Boolean,
    default:false
  },
  empresa: {
    type: Schema.Types.ObjectId,
    ref: "Empresa",
    required: true
  },
  moneda: {
    type: Schema.Types.ObjectId,
    ref: "Moneda",
  },
  activated: {
    type: Boolean,
    default: false,
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",

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

PagoProgramadoSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('PagosProgramado', PagoProgramadoSchema)