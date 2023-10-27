const { response } = require('express')
const bcrypt = require('bcryptjs')
const ContacType = require('../models/contacType')
const { generarJWT } = require('../helpers/jwt')
//getContacTypes ContacType
const getContacTypes = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [contacTypes, total] = await Promise.all([
      ContacType.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      ContacType.countDocuments(),
    ])

    res.json({
      ok: true,
      contacTypes,
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
  const [contacTypes, total] = await Promise.all([
    ContacType.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ContacType.countDocuments(),
  ])

  res.json({
    ok: true,
    contacTypes,
    uid: req.uid,
    total,
  })
}
const getAllContacTypes = async (req, res) => {

  try {
    const [contacTypes, total] = await Promise.all([
      ContacType.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      ContacType.countDocuments(),
    ])


    res.json({
      ok: true,
      contacTypes,
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

//crearContacType ContacType
const crearContacType = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const contacType = new ContacType({
      ...campos
    })


    await contacType.save()


    res.json({
      ok: true,
      contacType
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarContacType ContacType
const actualizarContacType = async (req, res = response) => {
  //Validar token y comporbar si es el scontacType
  const uid = req.params.id
  try {
    const contacTypeDB = await ContacType.findById(uid)
    if (!contacTypeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacType',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!contacTypeDB.google) {
      campos.email = email
    } else if (contacTypeDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El contacType de Google  no se puede actualizar',
      })
    }


    const contacTypeActualizado = await ContacType.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      contacTypeActualizado,
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
    const contacTypeDB = await ContacType.findById(uid)
    if (!contacTypeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacType',
      })
    }
    const campos = req.body
    campos.activated = !contacTypeDB.activated
    const contacTypeActualizado = await ContacType.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      contacTypeActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getContacTypeById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const contacTypeDB = await ContacType.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!contacTypeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacType',
      })
    }
    res.json({
      ok: true,
      contacType: contacTypeDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getContacTypeByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const contacTypeDB = await ContacType.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!contacTypeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacType',
      })
    }
    res.json({
      ok: true,
      contacType: contacTypeDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getContacTypeForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const contacTypeDB = await ContacType.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!contacTypeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un contacType',
      })
    }
    res.json({
      ok: true,
      contacTypes: contacTypeDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getContacTypes,
  crearContacType,
  actualizarContacType,
  isActive,
  getContacTypeById,
  getAllContacTypes,
  getContacTypeForSln,
  getContacTypeByClave
}
