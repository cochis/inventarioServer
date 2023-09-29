const { response } = require('express')
const bcrypt = require('bcryptjs')
const Asignacion = require('../models/asignacion')
const { generarJWT } = require('../helpers/jwt')
//getAsignacions Asignacion
const getAsignacions = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [asignacions, total] = await Promise.all([
    Asignacion.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Asignacion.countDocuments(),
  ])

  res.json({
    ok: true,
    asignacions,
    uid: req.uid,
    total,
  })
}
const getAllAsignacions = async (req, res) => {
  const [asignacions, total] = await Promise.all([
    Asignacion.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Asignacion.countDocuments(),
  ])

  res.json({
    ok: true,
    asignacions,
    uid: req.uid,
    total,
  })
}

//crearAsignacion Asignacion
const crearAsignacion = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const asignacion = new Asignacion({
      ...campos
    })


    await asignacion.save()


    res.json({
      ok: true,
      asignacion
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarAsignacion Asignacion
const actualizarAsignacion = async (req, res = response) => {
  //Validar token y comporbar si es el sasignacion
  const uid = req.params.id
  try {
    const asignacionDB = await Asignacion.findById(uid)
    if (!asignacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un asignacion',
      })
    }
    const { ...campos } = req.body
    const asignacionActualizado = await Asignacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      asignacionActualizado,
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
    const asignacionDB = await Asignacion.findById(uid)
    if (!asignacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un asignacion',
      })
    }
    const campos = req.body
    campos.activated = !asignacionDB.activated
    const asignacionActualizado = await Asignacion.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      asignacionActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getAsignacionById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const asignacionDB = await Asignacion.findById(uid)
    if (!asignacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un asignacion',
      })
    }
    res.json({
      ok: true,
      asignacion: asignacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getAsignacionByEmail = async (req, res = response) => {
  const email = req.params.email

  try {
    const asignacionDB = await Asignacion.find({ email: email })
    if (!asignacionDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un asignacion',
      })
    }
    res.json({
      ok: true,
      asignacions: asignacionDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}

module.exports = {
  getAsignacions,
  crearAsignacion,
  actualizarAsignacion,
  isActive,
  getAsignacionById,
  getAllAsignacions,
  getAsignacionByEmail

}
