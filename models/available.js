const { Schema, model } = require('mongoose')
const AvailableSchema = Schema({
 
   
  jasuPO: {
    type: String,
    required: true,
  },
   
  status: {
    type: Schema.Types.ObjectId,
    ref: "Status",
  },
   
  spec: {
    type: String,
 
  },
    name: {
    type: String,
 
  },
    company: {
    type: String,
 
  },
    ownerBy: {
    type: String,
 
  },
    costumerService: {
    type: String,
 
  },
    dateAssessed: {
    type: String,
 
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
  },
  presentation: {
    type: Schema.Types.ObjectId,
    ref: "Presentacion",
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: "Tipo",
  },
  drums: {
    type: Number,
 
  },
  volume: {
    type: Number,
 
  },
  costVolume: {
    type: Number,
 
  },
  salesPrice: {
    type: Number,
 
  },
  countryOrigin: {
    type: Schema.Types.ObjectId,
    ref: "Tipo",
  },
  paymentTerm: {
    type: Schema.Types.ObjectId,
    ref: "PagosTermino",
  },
  incoterm: {
    type: Schema.Types.ObjectId,
    ref: "Incoterm",
  },
  portCity: {
    type: string,
 
  },
  numberLoads: {
    type: Number,
 
  },
  notes: {
    type: string,
 
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

AvailableSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Available', AvailableSchema)
