const { response } = require('express')
const bcrypt = require('bcryptjs')
const Oportunity = require('../models/oportunity')
const { generarJWT } = require('../helpers/jwt')
//getOportunities Oportunity
const getOportunities = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [oportunities, total] = await Promise.all([
      Oportunity.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Oportunity.countDocuments(),
    ])

    res.json({
      ok: true,
      oportunities,
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
  const [oportunities, total] = await Promise.all([
    Oportunity.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Oportunity.countDocuments(),
  ])

  res.json({
    ok: true,
    oportunities,
    uid: req.uid,
    total,
  })
}
const getAllOportunities = async (req, res) => {

  try {
    const [oportunities, total] = await Promise.all([
      Oportunity.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Oportunity.countDocuments(),
    ])


    res.json({
      ok: true,
      oportunities,
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

//crearOportunity Oportunity
const crearOportunity = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const oportunity = new Oportunity({
      ...campos
    })


    await oportunity.save()


    res.json({
      ok: true,
      oportunity
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarOportunity Oportunity
const actualizarOportunity = async (req, res = response) => {
  //Validar token y comporbar si es el soportunity
  const uid = req.params.id
  try {
    const oportunityDB = await Oportunity.findById(uid)
    if (!oportunityDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un oportunity',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!oportunityDB.google) {
      campos.email = email
    } else if (oportunityDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El oportunity de Google  no se puede actualizar',
      })
    }


    const oportunityActualizado = await Oportunity.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      oportunityActualizado,
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
    const oportunityDB = await Oportunity.findById(uid)
    if (!oportunityDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un oportunity',
      })
    }
    const campos = req.body
    campos.activated = !oportunityDB.activated
    const oportunityActualizado = await Oportunity.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      oportunityActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getOportunityById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const oportunityDB = await Oportunity.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!oportunityDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un oportunity',
      })
    }
    res.json({
      ok: true,
      oportunity: oportunityDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getOportunityByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const oportunityDB = await Oportunity.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!oportunityDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un oportunity',
      })
    }
    res.json({
      ok: true,
      oportunity: oportunityDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getOportunityForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const oportunityDB = await Oportunity.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!oportunityDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un oportunity',
      })
    }
    res.json({
      ok: true,
      oportunities: oportunityDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getOportunities,
  crearOportunity,
  actualizarOportunity,
  isActive,
  getOportunityById,
  getAllOportunities,
  getOportunityForSln,
  getOportunityByClave
}
