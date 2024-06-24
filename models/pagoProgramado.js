const { Schema, model } = require('mongoose')
const PagoProgramadoSchema = Schema({
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
    type: String,
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
  concepto: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  fechaProgramada: {
    type: Number,

  },
  aprobacion: {
    type: Boolean,
    default: false
  },
  moneda: {
    type: Schema.Types.ObjectId,
    ref: "Moneda",

  },
  observaciones: {
    type: String,

  },
  factura: {
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

PagoProgramadoSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('PagosProgramado', PagoProgramadoSchema)
