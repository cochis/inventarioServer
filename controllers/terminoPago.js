const { response } = require('express')
const bcrypt = require('bcryptjs')
const TerminoPago = require('../models/terminoPago')
const { generarJWT } = require('../helpers/jwt')
//getTerminoPagos TerminoPago
const getTerminoPagos = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [terminoPagos, total] = await Promise.all([
      TerminoPago.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TerminoPago.countDocuments(),
    ])

    res.json({
      ok: true,
      terminoPagos,
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
  const [terminoPagos, total] = await Promise.all([
    TerminoPago.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TerminoPago.countDocuments(),
  ])

  res.json({
    ok: true,
    terminoPagos,
    uid: req.uid,
    total,
  })
}
const getAllTerminoPagos = async (req, res) => {

  try {
    const [terminoPagos, total] = await Promise.all([
      TerminoPago.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TerminoPago.countDocuments(),
    ])


    res.json({
      ok: true,
      terminoPagos,
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

//crearTerminoPago TerminoPago
const crearTerminoPago = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const terminoPago = new TerminoPago({
      ...campos
    })


    await terminoPago.save()


    res.json({
      ok: true,
      terminoPago
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTerminoPago TerminoPago
const actualizarTerminoPago = async (req, res = response) => {
  //Validar token y comporbar si es el sterminoPago
  const uid = req.params.id
  try {
    const terminoPagoDB = await TerminoPago.findById(uid)
    if (!terminoPagoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un terminoPago',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!terminoPagoDB.google) {
      campos.email = email
    } else if (terminoPagoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El terminoPago de Google  no se puede actualizar',
      })
    }


    const terminoPagoActualizado = await TerminoPago.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      terminoPagoActualizado,
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
    const terminoPagoDB = await TerminoPago.findById(uid)
    if (!terminoPagoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un terminoPago',
      })
    }
    const campos = req.body
    campos.activated = !terminoPagoDB.activated
    const terminoPagoActualizado = await TerminoPago.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      terminoPagoActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTerminoPagoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const terminoPagoDB = await TerminoPago.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!terminoPagoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un terminoPago',
      })
    }
    res.json({
      ok: true,
      terminoPago: terminoPagoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTerminoPagoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const terminoPagoDB = await TerminoPago.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!terminoPagoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un terminoPago',
      })
    }
    res.json({
      ok: true,
      terminoPago: terminoPagoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTerminoPagoForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const terminoPagoDB = await TerminoPago.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!terminoPagoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un terminoPago',
      })
    }
    res.json({
      ok: true,
      terminoPagos: terminoPagoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTerminoPagos,
  crearTerminoPago,
  actualizarTerminoPago,
  isActive,
  getTerminoPagoById,
  getAllTerminoPagos,
  getTerminoPagoForSln,
  getTerminoPagoByClave
}
