const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoSolicitudViaje = require('../models/tipoSolicitudViaje')
const { generarJWT } = require('../helpers/jwt')
//getTipoSolicitudViajes TipoSolicitudViaje
const getTipoSolicitudViajes = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    TipoSolicitudViaje.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoSolicitudViaje.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getAllTipoSolicitudViajes = async (req, res) => {
 const [tipoSolicitudViajes, total] = await Promise.all([
    TipoSolicitudViaje.find({})
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    TipoSolicitudViaje.countDocuments(),
  ])
 

  res.json({
    ok: true,
    tipoSolicitudViajes,
    uid: req.uid,
    total,
  })
}

//crearTipoSolicitudViaje TipoSolicitudViaje
const crearTipoSolicitudViaje = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }

 
  try {


    const tipostock = new TipoSolicitudViaje({
      ...campos
    })


    await tipostock.save()


    res.json({
      ok: true,
      tipostock
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoSolicitudViaje TipoSolicitudViaje
const actualizarTipoSolicitudViaje = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await TipoSolicitudViaje.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipostockDB.google) {
      campos.email = email
    } else if (tipostockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipostock de Google  no se puede actualizar',
      })
    }


    const tipostockActualizado = await TipoSolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {
 
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await TipoSolicitudViaje.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await TipoSolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
      error:error
    })
  }
}
const confirmaTipoSolicitudViaje = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await TipoSolicitudViaje.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipostockDB.google) {
      campos.email = email
    } else if (tipostockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipostock de Google  no se puede actualizar',
      })
    }


    const tipostockActualizado = await TipoSolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
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
    const tipostockDB = await TipoSolicitudViaje.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await TipoSolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoSolicitudViajeById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await TipoSolicitudViaje.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      tipoSolicitudViaje: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getTipoSolicitudViajes,
  crearTipoSolicitudViaje,
  actualizarTipoSolicitudViaje,
  isActive,
  getTipoSolicitudViajeById,
  getAllTipoSolicitudViajes 

}
