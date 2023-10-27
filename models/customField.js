const { Schema, model } = require('mongoose')
const CustomFieldSchema = Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  data_type: {
    type: String
  },
  available_on: [{
    type: String
  }],
  is_filterable:{
    type: Boolean
  }, 
  
  options: [{
    id: {
      type:Number,
  
    },
    name: {
      type: String,
  
    },
    rank: {
      type: Number,
  
    },
     
  }],
   
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

CustomFieldSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('CustomField', CustomFieldSchema)
