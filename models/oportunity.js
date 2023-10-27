const { Schema, model } = require('mongoose')
const CompanySchema = Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  close_date: {
    type: String

  },
  pipeline_id: {
    type: Number

  },
  pipeline_stage_id: {
    type: Number

  },
  priority: {
    type: String

  },
  status: {
    type: String

  },
  tags: [{
    type: String

  }],
  interaction_count: {
    type: Number

  },
  converted_unit: {
    type: String

  },
  converted_value: {
    type: String

  },
  date_stage_changed: {
    type: Number

  },
  leads_converted_from: [{
    type: String

  }],
  date_lead_created: {
    type: String

  },

  date_created: {
    type: Number

  },
  date_modified: {
    type: Number

  },

  custom_fields: [{
    custom_field_definition_id: {
      type: Number

    },
    value: {

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
  assignee_id: {
    type: Number,
     

  },
  company_id: {
    type: Number
   

  },
  customer_source_id: {
    type: Number
  },
  details: {
    type: String
  },
  loss_reason_id: {
    type: Number
  },
  primary_contact_id: {
    type: Number
  },
  monetary_unit: {
    type: String
  },
  monetary_value: {
    type: Number
  },
  win_probability: {
    type: Number
  },
  date_last_contacted: {
    type: Number
  },

})

CompanySchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject()
  object.uid = _id
  return object
})
module.exports = model('Oportunity', CompanySchema)
