const { Schema, model } = require('mongoose')
const ClienteLoopSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  taxId: {
    type: String,
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
  lastEdited: {
    type: Number,
    required: true,
    default: Date.now(),
  },

})

ClienteLoopSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('ClienteLoop', ClienteLoopSchema)
