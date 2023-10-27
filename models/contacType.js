const { Schema, model } = require('mongoose')
const ContacTypeSchema = Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
 
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "ContacType",
    default: null

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

ContacTypeSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('ContacType', ContacTypeSchema)
