const { response } = require('express')
const bcrypt = require('bcryptjs')
const Planta = require('../models/planta')
const { generarJWT } = require('../helpers/jwt')
//getPlantas Planta
const getPlantas = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [plantas, total] = await Promise.all([
      Planta.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Planta.countDocuments(),
    ])

    res.json({
      ok: true,
      plantas,
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
  const [plantas, total] = await Promise.all([
    Planta.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Planta.countDocuments(),
  ])

  res.json({
    ok: true,
    plantas,
    uid: req.uid,
    total,
  })
}
const getAllPlantas = async (req, res) => {

  try {
    const [plantas, total] = await Promise.all([
      Planta.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Planta.countDocuments(),
    ])


    res.json({
      ok: true,
      plantas,
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

//crearPlanta Planta
const crearPlanta = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const planta = new Planta({
      ...campos
    })


    await planta.save()


    res.json({
      ok: true,
      planta
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarPlanta Planta
const actualizarPlanta = async (req, res = response) => {
  //Validar token y comporbar si es el splanta
  const uid = req.params.id
  try {
    const plantaDB = await Planta.findById(uid)
    if (!plantaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un planta',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!plantaDB.google) {
      campos.email = email
    } else if (plantaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El planta de Google  no se puede actualizar',
      })
    }


    const plantaActualizado = await Planta.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      plantaActualizado,
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
    const plantaDB = await Planta.findById(uid)
    if (!plantaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un planta',
      })
    }
    const campos = req.body
    campos.activated = !plantaDB.activated
    const plantaActualizado = await Planta.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      plantaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getPlantaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const plantaDB = await Planta.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!plantaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un planta',
      })
    }
    res.json({
      ok: true,
      planta: plantaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getPlantaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const plantaDB = await Planta.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!plantaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un planta',
      })
    }
    res.json({
      ok: true,
      planta: plantaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getPlantaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const plantaDB = await Planta.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!plantaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un planta',
      })
    }
    res.json({
      ok: true,
      plantas: plantaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getPlantas,
  crearPlanta,
  actualizarPlanta,
  isActive,
  getPlantaById,
  getAllPlantas,
  getPlantaForSln,
  getPlantaByClave
}
