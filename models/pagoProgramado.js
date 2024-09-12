const { Schema, model } = require('mongoose')
const PagoProgramadoSchema = Schema({
  consecutivo: {
    type: Number
  },
  urgente: {
    type: Boolean,
    default:false
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
    type: String ,
    default:null
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
    default:null
     },
  concepto: {
    type: String, 
    default:null
  },
  conceptoLoop: {
    type: Schema.Types.ObjectId,
    ref: "ConceptoLoop",
    default:null
  },
  otroConcepto: {
    type: String, 
    default:null
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
    default:null
  },
  pagado: {
    type: Boolean,
    default: false
  },

  fechaProgramada: {
    type: Number,
    default:null
    
  },
  fechaVencimiento: {
    type: Number,
    default:null
  },
  
  quote: {
    type: String,
    default:null
  },
  aprobacion: {
    type: Boolean,
    default: false
  },
 
  observaciones: {
    type: String,
    default:null
  },
  factura: {
    type: String,
    default:null
  },
  tipoFactura: {
    type: String,
    default:null
  },
  numeroFactura: {
    type: String,
    default:null
  },
  cotizacion: {
    type: String,
    default:null
  },
  comprobante: {
    type: String,
    default:null
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
    required: true
  },
  activated: {
    type: Boolean,
    default: false,
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
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