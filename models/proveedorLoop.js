const { Schema, model } = require('mongoose')
const ProveedorLoopSchema = Schema({

  taxId: {
    type: String,

  },
  name: {
    type: String,

  },
  pais: {
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

ProveedorLoopSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('ProveedorLoop', ProveedorLoopSchema)
