const { response } = require('express')
const bcrypt = require('bcryptjs')
const Carga = require('../models/carga')
const { generarJWT } = require('../helpers/jwt')
//getCargas Carga
const getCargas = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [cargas, total] = await Promise.all([
      Carga.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Carga.countDocuments(),
    ])

    res.json({
      ok: true,
      cargas,
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
  const [cargas, total] = await Promise.all([
    Carga.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Carga.countDocuments(),
  ])

  res.json({
    ok: true,
    cargas,
    uid: req.uid,
    total,
  })
}
const getAllCargas = async (req, res) => {

  try {
    const [cargas, total] = await Promise.all([
      Carga.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Carga.countDocuments(),
    ])


    res.json({
      ok: true,
      cargas,
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

//crearCarga Carga
const crearCarga = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const carga = new Carga({
      ...campos
    })


    await carga.save()


    res.json({
      ok: true,
      carga
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarCarga Carga
const actualizarCarga = async (req, res = response) => {
  //Validar token y comporbar si es el scarga
  const uid = req.params.id
  try {
    const cargaDB = await Carga.findById(uid)
    if (!cargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un carga',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!cargaDB.google) {
      campos.email = email
    } else if (cargaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El carga de Google  no se puede actualizar',
      })
    }


    const cargaActualizado = await Carga.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cargaActualizado,
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
    const cargaDB = await Carga.findById(uid)
    if (!cargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un carga',
      })
    }
    const campos = req.body
    campos.activated = !cargaDB.activated
    const cargaActualizado = await Carga.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      cargaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getCargaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const cargaDB = await Carga.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!cargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un carga',
      })
    }
    res.json({
      ok: true,
      carga: cargaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCargaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const cargaDB = await Carga.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!cargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un carga',
      })
    }
    res.json({
      ok: true,
      carga: cargaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCargaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const cargaDB = await Carga.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!cargaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un carga',
      })
    }
    res.json({
      ok: true,
      cargas: cargaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getCargas,
  crearCarga,
  actualizarCarga,
  isActive,
  getCargaById,
  getAllCargas,
  getCargaForSln,
  getCargaByClave
}
