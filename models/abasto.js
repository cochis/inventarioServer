const { Schema, model } = require('mongoose')
const AbastoSchema = Schema({
  origen: {
    type: Schema.Types.ObjectId,
    ref: "Origen",
  },
  destino: {
    type: Schema.Types.ObjectId,
    ref: "Destino",
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "Proveedor",
  },
  materiaPrima: [{
    type: Schema.Types.ObjectId,
    ref: "MateriaPrima",
  }],
  unidadMedida: {
    type: Schema.Types.ObjectId,
    ref: "UnidadMedida",
  },
  cantidadTotal: {
    type: Number,
  },
  cantidadOrigenProceso: {
    type: Number,
  
  },
  cantidadDestinoProceso: {
    type: Number,
 
  },
  
  viajes: [{
    viajeFinalizado: {
      type: Boolean,
  
    },
    numeroTicket: {
      type: String,
  
    },
    tipoTransporte: {
      type: Boolean,
      required: true,
    },
    carga: {
      type: Schema.Types.ObjectId,
      ref: "Carga",
      required: true,
  
    },
    tipoCarga: {
      type: Schema.Types.ObjectId,
      ref: "TipoCarga",
      required: true,
  
    },
    basculaOrigen1: {
      type: Number,
  
    },
    basculaOrigen2: {
      type: Number,
  
    },
    fotoTicketOrigen: {
      type: String,
  
    },
    basculaDestino1: {
      type: Number,
  
    },
    basculaDestino2: {
      type: Number,
  
    },
    fotoTicketDestino: {
      type: String,
  
    },
    fechaProceso: {
      type: Number,
  
    },
    fechaAbasto: {
      type: Number,
  
    },
  }],
  finalizado: {
    type: Boolean,
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

AbastoSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Abasto', AbastoSchema)
