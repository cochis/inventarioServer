const { response } = require('express')
const bcrypt = require('bcryptjs')
const Abasto = require('../models/abasto')
const { generarJWT } = require('../helpers/jwt')
//getAbastos Abasto
const getAbastos = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [abastos, total] = await Promise.all([
      Abasto.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Abasto.countDocuments(),
    ])

    res.json({
      ok: true,
      abastos,
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
  const [abastos, total] = await Promise.all([
    Abasto.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Abasto.countDocuments(),
  ])

  res.json({
    ok: true,
    abastos,
    uid: req.uid,
    total,
  })
}
const getAllAbastos = async (req, res) => {

  try {
    const [abastos, total] = await Promise.all([
      Abasto.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Abasto.countDocuments(),
    ])


    res.json({
      ok: true,
      abastos,
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

//crearAbasto Abasto
const crearAbasto = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const abasto = new Abasto({
      ...campos
    })


    await abasto.save()


    res.json({
      ok: true,
      abasto
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarAbasto Abasto
const actualizarAbasto = async (req, res = response) => {
  //Validar token y comporbar si es el sabasto
  const uid = req.params.id
  try {
    const abastoDB = await Abasto.findById(uid)
    if (!abastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un abasto',
      })
    }
    const {  ...campos } = req.body
   
     


    const abastoActualizado = await Abasto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      abastoActualizado,
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
    const abastoDB = await Abasto.findById(uid)
    if (!abastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un abasto',
      })
    }
    const campos = req.body
    campos.activated = !abastoDB.activated
    const abastoActualizado = await Abasto.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      abastoActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getAbastoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const abastoDB = await Abasto.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!abastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un abasto',
      })
    }
    res.json({
      ok: true,
      abasto: abastoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getAbastoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const abastoDB = await Abasto.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!abastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un abasto',
      })
    }
    res.json({
      ok: true,
      abasto: abastoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getAbastoForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const abastoDB = await Abasto.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!abastoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un abasto',
      })
    }
    res.json({
      ok: true,
      abastos: abastoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getAbastos,
  crearAbasto,
  actualizarAbasto,
  isActive,
  getAbastoById,
  getAllAbastos,
  getAbastoForSln,
  getAbastoByClave
}
