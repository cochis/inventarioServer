const { Schema, model } = require('mongoose')
const TicketSchema = Schema({
  tipoTicket: {
    type: Schema.Types.ObjectId,
    ref: "TipoTicket",
    required:true
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required:true
    
  },
  usuarioAtendio: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    
  },
  descripcion: {
    type: String,
    required: true,
  },
  respuesta: {
    type: String,
 
  },
  img: {
    type: String,
 
  },

 
  estado: {
    type: Schema.Types.ObjectId,
    ref: "EstadoTicket", 
    required:true
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

TicketSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Ticket', TicketSchema)
