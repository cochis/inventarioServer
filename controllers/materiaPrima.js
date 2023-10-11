const { response } = require('express')
const bcrypt = require('bcryptjs')
const MateriaPrima = require('../models/materiaPrima')
const { generarJWT } = require('../helpers/jwt')
//getMateriaPrimas MateriaPrima
const getMateriaPrimas = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [materiaPrimas, total] = await Promise.all([
      MateriaPrima.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      MateriaPrima.countDocuments(),
    ])

    res.json({
      ok: true,
      materiaPrimas,
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
  const [materiaPrimas, total] = await Promise.all([
    MateriaPrima.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    MateriaPrima.countDocuments(),
  ])

  res.json({
    ok: true,
    materiaPrimas,
    uid: req.uid,
    total,
  })
}
const getAllMateriaPrimas = async (req, res) => {

  try {
    const [materiaPrimas, total] = await Promise.all([
      MateriaPrima.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      MateriaPrima.countDocuments(),
    ])


    res.json({
      ok: true,
      materiaPrimas,
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

//crearMateriaPrima MateriaPrima
const crearMateriaPrima = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const materiaPrima = new MateriaPrima({
      ...campos
    })


    await materiaPrima.save()


    res.json({
      ok: true,
      materiaPrima
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarMateriaPrima MateriaPrima
const actualizarMateriaPrima = async (req, res = response) => {
  //Validar token y comporbar si es el smateriaPrima
  const uid = req.params.id
  try {
    const materiaPrimaDB = await MateriaPrima.findById(uid)
    if (!materiaPrimaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un materiaPrima',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!materiaPrimaDB.google) {
      campos.email = email
    } else if (materiaPrimaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El materiaPrima de Google  no se puede actualizar',
      })
    }


    const materiaPrimaActualizado = await MateriaPrima.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      materiaPrimaActualizado,
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
    const materiaPrimaDB = await MateriaPrima.findById(uid)
    if (!materiaPrimaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un materiaPrima',
      })
    }
    const campos = req.body
    campos.activated = !materiaPrimaDB.activated
    const materiaPrimaActualizado = await MateriaPrima.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      materiaPrimaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getMateriaPrimaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const materiaPrimaDB = await MateriaPrima.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!materiaPrimaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un materiaPrima',
      })
    }
    res.json({
      ok: true,
      materiaPrima: materiaPrimaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getMateriaPrimaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const materiaPrimaDB = await MateriaPrima.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!materiaPrimaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un materiaPrima',
      })
    }
    res.json({
      ok: true,
      materiaPrima: materiaPrimaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getMateriaPrimaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const materiaPrimaDB = await MateriaPrima.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!materiaPrimaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un materiaPrima',
      })
    }
    res.json({
      ok: true,
      materiaPrimas: materiaPrimaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getMateriaPrimas,
  crearMateriaPrima,
  actualizarMateriaPrima,
  isActive,
  getMateriaPrimaById,
  getAllMateriaPrimas,
  getMateriaPrimaForSln,
  getMateriaPrimaByClave
}
