const { response } = require('express')
const bcrypt = require('bcryptjs')
const CustomField = require('../models/customField')
const { generarJWT } = require('../helpers/jwt')
//getCustomFields CustomField
const getCustomFields = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [customFields, total] = await Promise.all([
      CustomField.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      CustomField.countDocuments(),
    ])

    res.json({
      ok: true,
      customFields,
      uid: req.uid,
      total,
    })
  } catch (error) {
    
    res.json({
      ok: false,
      error:error
    })
  }
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [customFields, total] = await Promise.all([
    CustomField.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    CustomField.countDocuments(),
  ])

  res.json({
    ok: true,
    customFields,
    uid: req.uid,
    total,
  })
}
const getAllCustomFields = async (req, res) => {

  try {
    const [customFields, total] = await Promise.all([
      CustomField.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      CustomField.countDocuments(),
    ])


    res.json({
      ok: true,
      customFields,
      uid: req.uid,
      total,
    })
  } catch (error) {
 
    res.json({
      ok: false,
      error
    })

  }

}

//crearCustomField CustomField
const crearCustomField = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const customField = new CustomField({
      ...campos
    })


    await customField.save()


    res.json({
      ok: true,
      customField
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarCustomField CustomField
const actualizarCustomField = async (req, res = response) => {
  //Validar token y comporbar si es el scustomField
  const uid = req.params.id
  try {
    const customFieldDB = await CustomField.findById(uid)
    if (!customFieldDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un customField',
      })
    }
    const {  ...campos } = req.body
    const customFieldActualizado = await CustomField.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      customFieldActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
      error:error,
    })
  }
}


const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const customFieldDB = await CustomField.findById(uid)
    if (!customFieldDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un customField',
      })
    }
    const campos = req.body
    campos.activated = !customFieldDB.activated
    const customFieldActualizado = await CustomField.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      customFieldActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getCustomFieldById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const customFieldDB = await CustomField.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!customFieldDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un customField',
      })
    }
    res.json({
      ok: true,
      customField: customFieldDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCustomFieldByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const customFieldDB = await CustomField.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!customFieldDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un customField',
      })
    }
    res.json({
      ok: true,
      customField: customFieldDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCustomFieldForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const customFieldDB = await CustomField.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!customFieldDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un customField',
      })
    }
    res.json({
      ok: true,
      customFields: customFieldDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getCustomFields,
  crearCustomField,
  actualizarCustomField,
  isActive,
  getCustomFieldById,
  getAllCustomFields,
  getCustomFieldForSln,
  getCustomFieldByClave
}
