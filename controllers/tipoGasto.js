const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoGasto = require('../models/tipoGasto')
const { generarJWT } = require('../helpers/jwt')
//getTipoGastos TipoGasto
const getTipoGastos = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoGastos, total] = await Promise.all([
      TipoGasto.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated')
        .populate('aprobacionPor')
        .skip(desde)
        .limit(cant),
      TipoGasto.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoGastos,
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
  const [tipoGastos, total] = await Promise.all([
    TipoGasto.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated')
      .populate('aprobacionPor')
      .skip(desde)
      .limit(cant),
    TipoGasto.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoGastos,
    uid: req.uid,
    total,
  })
}
const getAllTipoGastos = async (req, res) => {

  try {
    const [tipoGastos, total] = await Promise.all([
      TipoGasto.find({})
      .populate('usuarioCreated')
      .populate('aprobacionPor')
        .sort({ nombre: 1 }),
      TipoGasto.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoGastos,
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

//crearTipoGasto TipoGasto
const crearTipoGasto = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const tipoGasto = new TipoGasto({
      ...campos
    })


    await tipoGasto.save()


    res.json({
      ok: true,
      tipoGasto
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoGasto TipoGasto
const actualizarTipoGasto = async (req, res = response) => {
  //Validar token y comporbar si es el stipoGasto
  const uid = req.params.id
  try {
    const tipoGastoDB = await TipoGasto.findById(uid)
    if (!tipoGastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoGasto',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoGastoDB.google) {
      campos.email = email
    } else if (tipoGastoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoGasto de Google  no se puede actualizar',
      })
    }


    const tipoGastoActualizado = await TipoGasto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoGastoActualizado,
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
    const tipoGastoDB = await TipoGasto.findById(uid)
    if (!tipoGastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoGasto',
      })
    }
    const campos = req.body
    campos.activated = !tipoGastoDB.activated
    const tipoGastoActualizado = await TipoGasto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoGastoActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoGastoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoGastoDB = await TipoGasto.findById(uid)
    .populate('usuarioCreated')
    .populate('aprobacionPor')
    if (!tipoGastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoGasto',
      })
    }
    res.json({
      ok: true,
      tipoGasto: tipoGastoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoGastoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoGastoDB = await TipoGasto.find({ clave: clave })
    .populate('usuarioCreated')
    .populate('aprobacionPor')
    if (!tipoGastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoGasto',
      })
    }
    res.json({
      ok: true,
      tipoGasto: tipoGastoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoGastoForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoGastoDB = await TipoGasto.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
    .populate('usuarioCreated')
    .populate('aprobacionPor')
    if (!tipoGastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoGasto',
      })
    }
    res.json({
      ok: true,
      tipoGastos: tipoGastoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTipoGastos,
  crearTipoGasto,
  actualizarTipoGasto,
  isActive,
  getTipoGastoById,
  getAllTipoGastos,
  getTipoGastoForSln,
  getTipoGastoByClave
}
