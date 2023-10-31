const { Schema, model } = require('mongoose')
const CompanySchema = Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    country: {
      type: String,
    },
  },

  assignee_id: {
    type: Number

  },
  contact_type_id: {
    type: Number

  },
  details: {
    type: String

  },
  email_domain: {
    type: String

  },
  phone_numbers: [{
    number: {
      type: String

    },
    category: {
      type: String

    },
  }],
  socials: [{
    url: {
      type: String

    },
    category: {
      type: String

    },
  }],
  tags: [
    { type: String }

  ],
  interaction_count:
    { type: Number }

  ,
  websites: [{
    url: {
      type: String

    },
    category: {
      type: String

    },
  }],
  custom_fields: [{
    custom_field_definition_id: {
      type: Number

    },
    value: {
      type: Object
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
  date_created: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  date_modified: {
    type: Number,
    required: true,
    default: Date.now(),
  },

})

CompanySchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Company', CompanySchema)
