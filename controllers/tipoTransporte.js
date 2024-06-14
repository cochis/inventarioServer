const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoTransporte = require('../models/tipoTransporte')
const { generarJWT } = require('../helpers/jwt')
//getTipoTransportes TipoTransporte
const getTipoTransportes = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoTransportes, total] = await Promise.all([
      TipoTransporte.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TipoTransporte.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoTransportes,
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
  const [tipoTransportes, total] = await Promise.all([
    TipoTransporte.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoTransporte.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoTransportes,
    uid: req.uid,
    total,
  })
}
const getAllTipoTransportes = async (req, res) => {

  try {
    const [tipoTransportes, total] = await Promise.all([
      TipoTransporte.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TipoTransporte.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoTransportes,
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

//crearTipoTransporte TipoTransporte
const crearTipoTransporte = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const tipoTransporte = new TipoTransporte({
      ...campos
    })


    await tipoTransporte.save()


    res.json({
      ok: true,
      tipoTransporte
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoTransporte TipoTransporte
const actualizarTipoTransporte = async (req, res = response) => {
  //Validar token y comporbar si es el stipoTransporte
  const uid = req.params.id
  try {
    const tipoTransporteDB = await TipoTransporte.findById(uid)
    if (!tipoTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoTransporte',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoTransporteDB.google) {
      campos.email = email
    } else if (tipoTransporteDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoTransporte de Google  no se puede actualizar',
      })
    }


    const tipoTransporteActualizado = await TipoTransporte.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoTransporteActualizado,
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
    const tipoTransporteDB = await TipoTransporte.findById(uid)
    if (!tipoTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoTransporte',
      })
    }
    const campos = req.body
    campos.activated = !tipoTransporteDB.activated
    const tipoTransporteActualizado = await TipoTransporte.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoTransporteActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoTransporteById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoTransporteDB = await TipoTransporte.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoTransporte',
      })
    }
    res.json({
      ok: true,
      tipoTransporte: tipoTransporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoTransporteByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoTransporteDB = await TipoTransporte.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoTransporte',
      })
    }
    res.json({
      ok: true,
      tipoTransporte: tipoTransporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoTransporteForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoTransporteDB = await TipoTransporte.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoTransporte',
      })
    }
    res.json({
      ok: true,
      tipoTransportes: tipoTransporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTipoTransportes,
  crearTipoTransporte,
  actualizarTipoTransporte,
  isActive,
  getTipoTransporteById,
  getAllTipoTransportes,
  getTipoTransporteForSln,
  getTipoTransporteByClave
}
