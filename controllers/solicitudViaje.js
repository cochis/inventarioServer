const { response } = require('express')
const bcrypt = require('bcryptjs')
const SolicitudViaje = require('../models/solicitudViaje')
const { generarJWT } = require('../helpers/jwt')
//getSolicitudViajes SolicitudViaje
const getSolicitudViajes = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [solicitudViajes, total] = await Promise.all([
    SolicitudViaje.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('tipoSolicitudViaje' )
    .populate('moneda' )
    .populate('tipoTransporte' )
    .populate('empleado' )
      .skip(desde)
      .limit(cant),
    SolicitudViaje.countDocuments(),
  ])

  res.json({
    ok: true,
    solicitudViajes,
    uid: req.uid,
    total,
  })
}
const getAllSolicitudViajes = async (req, res) => {
  const [solicitudViajes, total] = await Promise.all([
    SolicitudViaje.find({})
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('tipoSolicitudViaje' )
    .populate('moneda' )
    .populate('tipoTransporte' )
    .populate('empleado' )
      .sort({ nombre: 1 }),
    SolicitudViaje.countDocuments(),
  ])

  res.json({
    ok: true,
    solicitudViajes,
    uid: req.uid,
    total,
  })
}
//crearSolicitudViaje SolicitudViaje
const crearSolicitudViaje = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const solicitudViaje = new SolicitudViaje({
      ...campos
    })


    await solicitudViaje.save()


    res.json({
      ok: true,
      solicitudViaje
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}
//actualizarSolicitudViaje SolicitudViaje
const actualizarSolicitudViaje = async (req, res = response) => {
  //Validar token y comporbar si es el ssolicitudViaje
  const uid = req.params.id
  try {
    const solicitudViajeDB = await SolicitudViaje.findById(uid)
    if (!solicitudViajeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un solicitudViaje',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!solicitudViajeDB.google) {
      campos.email = email
    } else if (solicitudViajeDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El solicitudViaje de Google  no se puede actualizar',
      })
    }


    const solicitudViajeActualizado = await SolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      solicitudViajeActualizado,
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
    const solicitudViajeDB = await SolicitudViaje.findById(uid)
    if (!solicitudViajeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un solicitudViaje',
      })
    }
    const campos = req.body
    campos.activated = !solicitudViajeDB.activated
    const solicitudViajeActualizado = await SolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      solicitudViajeActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}
const getSolicitudViajeById = async (req, res = response) => {
  const uid = req.params.uid
 
  try {
    const solicitudViajeDB = await SolicitudViaje.findById(uid).populate('tipoSolicitudViaje', 'nombre clave  _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('tipoSolicitudViaje' )
    .populate('moneda' )
    .populate('tipoTransporte' )
    .populate('empleado' )
   
    if (!solicitudViajeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un solicitudViaje',
      })
    }
    res.json({
      ok: true,
      solicitudViaje: solicitudViajeDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
module.exports = {
  getSolicitudViajes,
  crearSolicitudViaje,
  getAllSolicitudViajes,
  actualizarSolicitudViaje,
  isActive,
  getSolicitudViajeById,

}
