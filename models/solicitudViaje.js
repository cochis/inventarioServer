const { Schema, model } = require('mongoose')

const SolicitudViajeSchema = Schema({
  tipoSolicitudViaje: {
    type: Schema.Types.ObjectId,
    ref: "TipoSolicitudViaje",
  },
  empleado: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
   
  dateViaje:{
    type:Number,
    required:   true,
  },
  duracion:{
    type:Number,
    required:   true,
  },
  destino:{
    type:String,
    required:   true,
  },
  proposito:{
    type:String,
    required:   true,
  },
  dateSalida:{
    type:Number,
    required:   true,
  },
  dateRegreso:{
    type:Number,
    required:   true,
  },
  medioTransporte:{
    type:String,
    required:   true,
  },
  tipoTransporte:{
    type: Schema.Types.ObjectId,
    ref: "TipoTransporte",
  },
  detalleTransporte:{
    type:String,
  },
  numeroTransporte:{
    type:String,
  },
  cantidadSolicitada:{
    type:Number,
    required:true
  },
  cantidadAprobada:{
    type:Number,
     
  },
  cantidadRegreso:{
    type:Number,
   
  },
   
  aprobado:{
    type:Boolean,
    default:false
  },
  fechaAprobacion:{
    type:Number ,
    default:0
     
  },

  fechaPagado:{
    type:Number ,
    default:0
     
  },
  pagado:{
    type:Number ,
    default:false
     
  },
  moneda: {
    type: Schema.Types.ObjectId,
    ref: "Moneda",
    
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

SolicitudViajeSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('SolicitudViaje', SolicitudViajeSchema)
