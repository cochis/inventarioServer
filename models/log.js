const { Schema, model } = require('mongoose')
const LogSchema = Schema({
 
   
  url: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
   
  queryParams: {
    type: String,
    required: true,
  },
  request: {
    type: Object,
    required: true,
  },
  response: {
    type: Object,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
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
})

LogSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Log', LogSchema)
