const { response } = require('express')
const bcrypt = require('bcryptjs')
const Transporte = require('../models/transporte')
const { generarJWT } = require('../helpers/jwt')
//getTransportes Transporte
const getTransportes = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [transportes, total] = await Promise.all([
      Transporte.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Transporte.countDocuments(),
    ])

    res.json({
      ok: true,
      transportes,
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
  const [transportes, total] = await Promise.all([
    Transporte.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Transporte.countDocuments(),
  ])

  res.json({
    ok: true,
    transportes,
    uid: req.uid,
    total,
  })
}
const getAllTransportes = async (req, res) => {

  try {
    const [transportes, total] = await Promise.all([
      Transporte.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Transporte.countDocuments(),
    ])


    res.json({
      ok: true,
      transportes,
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

//crearTransporte Transporte
const crearTransporte = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const transporte = new Transporte({
      ...campos
    })


    await transporte.save()


    res.json({
      ok: true,
      transporte
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTransporte Transporte
const actualizarTransporte = async (req, res = response) => {
  //Validar token y comporbar si es el stransporte
  const uid = req.params.id
  try {
    const transporteDB = await Transporte.findById(uid)
    if (!transporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un transporte',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!transporteDB.google) {
      campos.email = email
    } else if (transporteDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El transporte de Google  no se puede actualizar',
      })
    }


    const transporteActualizado = await Transporte.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      transporteActualizado,
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
    const transporteDB = await Transporte.findById(uid)
    if (!transporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un transporte',
      })
    }
    const campos = req.body
    campos.activated = !transporteDB.activated
    const transporteActualizado = await Transporte.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      transporteActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTransporteById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const transporteDB = await Transporte.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!transporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un transporte',
      })
    }
    res.json({
      ok: true,
      transporte: transporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTransporteByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const transporteDB = await Transporte.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!transporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un transporte',
      })
    }
    res.json({
      ok: true,
      transporte: transporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTransporteForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const transporteDB = await Transporte.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!transporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un transporte',
      })
    }
    res.json({
      ok: true,
      transportes: transporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTransportes,
  crearTransporte,
  actualizarTransporte,
  isActive,
  getTransporteById,
  getAllTransportes,
  getTransporteForSln,
  getTransporteByClave
}
