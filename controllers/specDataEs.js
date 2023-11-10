const { response } = require('express')
const bcrypt = require('bcryptjs')
const SpecDataEs = require('../models/specDataEs')
const { generarJWT } = require('../helpers/jwt')
//getSpecDataEss SpecDataEs
const getSpecDataEss = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [specDataEsstocks, total] = await Promise.all([
    SpecDataEs.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    SpecDataEs.countDocuments(),
  ])

  res.json({
    ok: true,
    specDataEsstocks,
    uid: req.uid,
    total,
  })
}
const getMySpecDataEss = async (req, res) => {
  const uid = req.params.uid
 const [specDataEss, total] = await Promise.all([
    SpecDataEs.find({usuarioCreated: uid})
    .populate('specDataEsSpecDataEs')
    .populate('estado')
    .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    SpecDataEs.countDocuments(),
  ])
 

  res.json({
    ok: true,
    specDataEss,
    uid: req.uid,
    total,
  })
}
const getAllSpecDataEss = async (req, res) => {

 
 const [specDataEss, total] = await Promise.all([
    SpecDataEs.find({})
     
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    .sort({ dateCreated: -1 }),
    SpecDataEs.countDocuments(),
  ])
 

  res.json({
    ok: true,
    dataEss: specDataEss,
    uid: req.uid,
    total,
  })
}

//crearSpecDataEs SpecDataEs
const crearSpecDataEs = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const specDataEs = new SpecDataEs({
      ...campos
    })


    await specDataEs.save()


    res.json({
      ok: true,
      dataEs:specDataEs
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarSpecDataEs SpecDataEs
const actualizarSpecDataEs = async (req, res = response) => {
  //Validar token y comporbar si es el sspecDataEsstock
  const uid = req.params.id
  try {
    const specDataEsstockDB = await SpecDataEs.findById(uid)
 
    if (!specDataEsstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un specDataEsstock',
      })
    }
     


    const specDataEsstockActualizado = await SpecDataEs.findByIdAndUpdate(uid, req.body, {
      new: true,
    })
    res.json({
      ok: true,
      specDataEsstockActualizado,
    })
  } catch (error) {
 
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el sspecDataEsstock
  const uid = req.params.id
  try {
    const specDataEsstockDB = await SpecDataEs.findById(uid)
    if (!specDataEsstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un specDataEsstock',
      })
    }
    const { ...campos } = req.body

    const specDataEsstockActualizado = await SpecDataEs.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      specDataEsstockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
      error:error
    })
  }
}
const confirmaSpecDataEs = async (req, res = response) => {
  //Validar token y comporbar si es el sspecDataEsstock
  const uid = req.params.id
  try {
    const specDataEsstockDB = await SpecDataEs.findById(uid)
    if (!specDataEsstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un specDataEsstock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!specDataEsstockDB.google) {
      campos.email = email
    } else if (specDataEsstockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El specDataEsstock de Google  no se puede actualizar',
      })
    }


    const specDataEsstockActualizado = await SpecDataEs.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      specDataEsstockActualizado,
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
    const specDataEsstockDB = await SpecDataEs.findById(uid)
    if (!specDataEsstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un specDataEsstock',
      })
    }
    const campos = req.body
    campos.activated = !specDataEsstockDB.activated
    const specDataEsstockActualizado = await SpecDataEs.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      specDataEsstockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getSpecDataEsById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const specDataEsstockDB = await SpecDataEs.findById(uid)
    if (!specDataEsstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un specDataEsstock',
      })
    }
    res.json({
      ok: true,
      dataEs: specDataEsstockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getSpecDataEss,
  crearSpecDataEs,
  actualizarSpecDataEs,
  isActive,
  getSpecDataEsById,
  getAllSpecDataEss,
  getMySpecDataEss

}
