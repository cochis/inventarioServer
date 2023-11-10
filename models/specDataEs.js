const { Schema, model } = require('mongoose')
const SpecDataEsSchema = Schema({
  numero: {
    type: String,
    required:true
  },
  producto: {
    type: String,
    required:true
  },
  fruta: {
    type: String,
    required:true
  },
  variedad: {
    type: String,
  },
  presentacion: {
    type: String,
  },
  tipo: {
    type: String,
  },
  paisOrigen: {
    type: String,
  },
  duracion: {
    type: String,
  },
  descripcion: {
    type: String,
  },
  img: {
    type: String,
  },
  url: {
    type: String,
  },
  jasuSpec: {
    type: String,
  },
  jasuMsds: {
    type: String,
  },
  msdsUrl: {
    type: String,
  },
  ingredientes: {
    type: String,
  },
  pc1: {
    type: String,
  },
  ppc1: {
    type: String,
  },
  pc2: {
    type: String,
  },
  ppc2: {
    type: String,
  },
  pc3: {
    type: String,
  },
  ppc3: {
    type: String,
  },
  pc4: {
    type: String,
  },
  ppc4: {
    type: String,
  },
  pc5: {
    type: String,
  },
  ppc5: {
    type: String,
  },
  pc6: {
    type: String,
  },
  ppc6: {
    type: String,
  },
  pc7: {
    type: String,
  },
  ppc7: {
    type: String,
  },
  usuarioCreated: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
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

SpecDataEsSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('SpecDataEs', SpecDataEsSchema)
