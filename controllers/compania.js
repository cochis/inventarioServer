const { response } = require('express')
const bcrypt = require('bcryptjs')
const Compania = require('../models/compania')
const { generarJWT } = require('../helpers/jwt')
//getCompanias Compania
const getCompanias = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [companias, total] = await Promise.all([
      Compania.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Compania.countDocuments(),
    ])

    res.json({
      ok: true,
      companias,
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
  const [companias, total] = await Promise.all([
    Compania.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Compania.countDocuments(),
  ])

  res.json({
    ok: true,
    companias,
    uid: req.uid,
    total,
  })
}
const getAllCompanias = async (req, res) => {

  try {
    const [companias, total] = await Promise.all([
      Compania.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Compania.countDocuments(),
    ])


    res.json({
      ok: true,
      companias,
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

//crearCompania Compania
const crearCompania = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const compania = new Compania({
      ...campos
    })


    await compania.save()


    res.json({
      ok: true,
      compania
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarCompania Compania
const actualizarCompania = async (req, res = response) => {
  //Validar token y comporbar si es el scompania
  const uid = req.params.id
  try {
    const companiaDB = await Compania.findById(uid)
    if (!companiaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compania',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!companiaDB.google) {
      campos.email = email
    } else if (companiaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El compania de Google  no se puede actualizar',
      })
    }


    const companiaActualizado = await Compania.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      companiaActualizado,
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
    const companiaDB = await Compania.findById(uid)
    if (!companiaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compania',
      })
    }
    const campos = req.body
    campos.activated = !companiaDB.activated
    const companiaActualizado = await Compania.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      companiaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getCompaniaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const companiaDB = await Compania.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!companiaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compania',
      })
    }
    res.json({
      ok: true,
      compania: companiaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCompaniaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const companiaDB = await Compania.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!companiaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compania',
      })
    }
    res.json({
      ok: true,
      compania: companiaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCompaniaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const companiaDB = await Compania.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!companiaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un compania',
      })
    }
    res.json({
      ok: true,
      companias: companiaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getCompanias,
  crearCompania,
  actualizarCompania,
  isActive,
  getCompaniaById,
  getAllCompanias,
  getCompaniaForSln,
  getCompaniaByClave
}
