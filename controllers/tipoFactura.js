const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoFactura = require('../models/tipoFactura')
const { generarJWT } = require('../helpers/jwt')
//getTipoFacturas TipoFactura
const getTipoFacturas = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoFacturas, total] = await Promise.all([
      TipoFactura.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated')
         
        .skip(desde)
        .limit(cant),
      TipoFactura.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoFacturas,
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
  const [tipoFacturas, total] = await Promise.all([
    TipoFactura.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated')
       
      .skip(desde)
      .limit(cant),
    TipoFactura.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoFacturas,
    uid: req.uid,
    total,
  })
}
const getAllTipoFacturas = async (req, res) => {

  try {
    const [tipoFacturas, total] = await Promise.all([
      TipoFactura.find({})
      .populate('usuarioCreated')
      
        .sort({ nombre: 1 }),
      TipoFactura.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoFacturas,
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

//crearTipoFactura TipoFactura
const crearTipoFactura = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const tipoFactura = new TipoFactura({
      ...campos
    })


    await tipoFactura.save()


    res.json({
      ok: true,
      tipoFactura
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoFactura TipoFactura
const actualizarTipoFactura = async (req, res = response) => {
  //Validar token y comporbar si es el stipoFactura
  const uid = req.params.id
  try {
    const tipoFacturaDB = await TipoFactura.findById(uid)
    if (!tipoFacturaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoFactura',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoFacturaDB.google) {
      campos.email = email
    } else if (tipoFacturaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoFactura de Google  no se puede actualizar',
      })
    }


    const tipoFacturaActualizado = await TipoFactura.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoFacturaActualizado,
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
    const tipoFacturaDB = await TipoFactura.findById(uid)
    if (!tipoFacturaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoFactura',
      })
    }
    const campos = req.body
    campos.activated = !tipoFacturaDB.activated
    const tipoFacturaActualizado = await TipoFactura.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoFacturaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoFacturaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoFacturaDB = await TipoFactura.findById(uid)
    .populate('usuarioCreated')
   
    if (!tipoFacturaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoFactura',
      })
    }
    res.json({
      ok: true,
      tipoFactura: tipoFacturaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoFacturaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoFacturaDB = await TipoFactura.find({ clave: clave })
    .populate('usuarioCreated')
     
    if (!tipoFacturaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoFactura',
      })
    }
    res.json({
      ok: true,
      tipoFactura: tipoFacturaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoFacturaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoFacturaDB = await TipoFactura.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
    .populate('usuarioCreated')
     
    if (!tipoFacturaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoFactura',
      })
    }
    res.json({
      ok: true,
      tipoFacturas: tipoFacturaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTipoFacturas,
  crearTipoFactura,
  actualizarTipoFactura,
  isActive,
  getTipoFacturaById,
  getAllTipoFacturas,
  getTipoFacturaForSln,
  getTipoFacturaByClave
}
