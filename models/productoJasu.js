const { Schema, model } = require('mongoose')
const ProductoJasuSchema = Schema({


  id: {
    type: String,

  },

  product: {
    type: String,

  },

  fruit: {
    type: String,

  },
  descriptionEn: {
    type: String,

  },
  image: {
    type: String,

  },
  url: {
    type: String,

  },
  category: {
    type: String,

  },
  producto: {
    type: String,

  },
  fruta: {
    type: String,

  },
  descripcionEs: {
    type: String,

  },
  imagen: {
    type: String,

  },
  categoria: {
    type: String,

  },
  variedad: {
    type: String,

  },
  variety: {
    type: String,

  },
  paisOrigen: {
    type: String,

  },
  countryOrigin: {
    type: String,

  },
  activated: {
    type: Boolean,
    default: false,
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",

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

ProductoJasuSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('ProductoJasu', ProductoJasuSchema)
