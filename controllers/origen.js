const { response } = require('express')
const bcrypt = require('bcryptjs')
const Origen = require('../models/origen')
const { generarJWT } = require('../helpers/jwt')
//getOrigens Origen
const getOrigens = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [origens, total] = await Promise.all([
      Origen.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Origen.countDocuments(),
    ])

    res.json({
      ok: true,
      origens,
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
  const [origens, total] = await Promise.all([
    Origen.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Origen.countDocuments(),
  ])

  res.json({
    ok: true,
    origens,
    uid: req.uid,
    total,
  })
}
const getAllOrigens = async (req, res) => {

  try {
    const [origens, total] = await Promise.all([
      Origen.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Origen.countDocuments(),
    ])


    res.json({
      ok: true,
      origens,
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

//crearOrigen Origen
const crearOrigen = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const origen = new Origen({
      ...campos
    })


    await origen.save()


    res.json({
      ok: true,
      origen
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarOrigen Origen
const actualizarOrigen = async (req, res = response) => {
  //Validar token y comporbar si es el sorigen
  const uid = req.params.id
  try {
    const origenDB = await Origen.findById(uid)
    if (!origenDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un origen',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!origenDB.google) {
      campos.email = email
    } else if (origenDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El origen de Google  no se puede actualizar',
      })
    }


    const origenActualizado = await Origen.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      origenActualizado,
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
    const origenDB = await Origen.findById(uid)
    if (!origenDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un origen',
      })
    }
    const campos = req.body
    campos.activated = !origenDB.activated
    const origenActualizado = await Origen.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      origenActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getOrigenById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const origenDB = await Origen.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!origenDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un origen',
      })
    }
    res.json({
      ok: true,
      origen: origenDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getOrigenByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const origenDB = await Origen.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!origenDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un origen',
      })
    }
    res.json({
      ok: true,
      origen: origenDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getOrigenForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const origenDB = await Origen.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!origenDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un origen',
      })
    }
    res.json({
      ok: true,
      origens: origenDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getOrigens,
  crearOrigen,
  actualizarOrigen,
  isActive,
  getOrigenById,
  getAllOrigens,
  getOrigenForSln,
  getOrigenByClave
}
