const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoCarga = require('../models/tipoCarga')
const { generarJWT } = require('../helpers/jwt')
//getTipoCargas TipoCarga
const getTipoCargas = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoCargas, total] = await Promise.all([
      TipoCarga.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TipoCarga.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoCargas,
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
  const [tipoCargas, total] = await Promise.all([
    TipoCarga.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoCarga.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoCargas,
    uid: req.uid,
    total,
  })
}
const getAllTipoCargas = async (req, res) => {

  try {
    const [tipoCargas, total] = await Promise.all([
      TipoCarga.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TipoCarga.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoCargas,
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

//crearTipoCarga TipoCarga
const crearTipoCarga = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const tipoCarga = new TipoCarga({
      ...campos
    })


    await tipoCarga.save()


    res.json({
      ok: true,
      tipoCarga
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoCarga TipoCarga
const actualizarTipoCarga = async (req, res = response) => {
  //Validar token y comporbar si es el stipoCarga
  const uid = req.params.id
  try {
    const tipoCargaDB = await TipoCarga.findById(uid)
    if (!tipoCargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCarga',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoCargaDB.google) {
      campos.email = email
    } else if (tipoCargaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoCarga de Google  no se puede actualizar',
      })
    }


    const tipoCargaActualizado = await TipoCarga.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoCargaActualizado,
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
    const tipoCargaDB = await TipoCarga.findById(uid)
    if (!tipoCargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCarga',
      })
    }
    const campos = req.body
    campos.activated = !tipoCargaDB.activated
    const tipoCargaActualizado = await TipoCarga.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoCargaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoCargaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoCargaDB = await TipoCarga.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoCargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCarga',
      })
    }
    res.json({
      ok: true,
      tipoCarga: tipoCargaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoCargaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoCargaDB = await TipoCarga.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoCargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCarga',
      })
    }
    res.json({
      ok: true,
      tipoCarga: tipoCargaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoCargaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoCargaDB = await TipoCarga.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoCargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoCarga',
      })
    }
    res.json({
      ok: true,
      tipoCargas: tipoCargaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTipoCargas,
  crearTipoCarga,
  actualizarTipoCarga,
  isActive,
  getTipoCargaById,
  getAllTipoCargas,
  getTipoCargaForSln,
  getTipoCargaByClave
}
