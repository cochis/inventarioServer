const { response } = require('express')
const bcrypt = require('bcryptjs')
const Subsidiaria = require('../models/subsidiaria')
const { generarJWT } = require('../helpers/jwt')
//getSubsidiarias Subsidiaria
const getSubsidiarias = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [subsidiarias, total] = await Promise.all([
      Subsidiaria.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated')
        .skip(desde)
        .limit(cant),
      Subsidiaria.countDocuments(),
    ])

    res.json({
      ok: true,
      subsidiarias,
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
  const [subsidiarias, total] = await Promise.all([
    Subsidiaria.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated')
      .skip(desde)
      .limit(cant),
    Subsidiaria.countDocuments(),
  ])

  res.json({
    ok: true,
    subsidiarias,
    uid: req.uid,
    total,
  })
}
const getAllSubsidiarias = async (req, res) => {

  try {
    const [subsidiarias, total] = await Promise.all([
      Subsidiaria.find({})
      .populate('usuarioCreated')
        .sort({ nombre: 1 }),
      Subsidiaria.countDocuments(),
    ])

   

    res.json({
      ok: true,
      subsidiarias,
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

//crearSubsidiaria Subsidiaria
const crearSubsidiaria = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const subsidiaria = new Subsidiaria({
      ...campos
    })


    await subsidiaria.save()


    res.json({
      ok: true,
      subsidiaria
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarSubsidiaria Subsidiaria
const actualizarSubsidiaria = async (req, res = response) => {
  //Validar token y comporbar si es el ssubsidiaria
  const uid = req.params.id
  try {
    const subsidiariaDB = await Subsidiaria.findById(uid)
    if (!subsidiariaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un subsidiaria',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!subsidiariaDB.google) {
      campos.email = email
    } else if (subsidiariaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El subsidiaria de Google  no se puede actualizar',
      })
    }


    const subsidiariaActualizado = await Subsidiaria.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      subsidiariaActualizado,
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
    const subsidiariaDB = await Subsidiaria.findById(uid)
    if (!subsidiariaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un subsidiaria',
      })
    }
    const campos = req.body
    campos.activated = !subsidiariaDB.activated
    const subsidiariaActualizado = await Subsidiaria.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      subsidiariaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getSubsidiariaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const subsidiariaDB = await Subsidiaria.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!subsidiariaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un subsidiaria',
      })
    }
    res.json({
      ok: true,
      subsidiaria: subsidiariaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getSubsidiariaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const subsidiariaDB = await Subsidiaria.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!subsidiariaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un subsidiaria',
      })
    }
    res.json({
      ok: true,
      subsidiaria: subsidiariaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getSubsidiariaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const subsidiariaDB = await Subsidiaria.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!subsidiariaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un subsidiaria',
      })
    }
    res.json({
      ok: true,
      subsidiarias: subsidiariaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getSubsidiarias,
  crearSubsidiaria,
  actualizarSubsidiaria,
  isActive,
  getSubsidiariaById,
  getAllSubsidiarias,
  getSubsidiariaForSln,
  getSubsidiariaByClave
}
