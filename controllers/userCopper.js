const { response } = require('express')
const bcrypt = require('bcryptjs')
const UserCopper = require('../models/userCopper')
const { generarJWT } = require('../helpers/jwt')
//getUserCoppers UserCopper
const getUserCoppers = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [userCoppers, total] = await Promise.all([
      UserCopper.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      UserCopper.countDocuments(),
    ])

    res.json({
      ok: true,
      userCoppers,
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
  const [userCoppers, total] = await Promise.all([
    UserCopper.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    UserCopper.countDocuments(),
  ])

  res.json({
    ok: true,
    userCoppers,
    uid: req.uid,
    total,
  })
}
const getAllUserCoppers = async (req, res) => {

  try {
    const [userCoppers, total] = await Promise.all([
      UserCopper.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      UserCopper.countDocuments(),
    ])


    res.json({
      ok: true,
      userCoppers,
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

//crearUserCopper UserCopper
const crearUserCopper = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const userCopper = new UserCopper({
      ...campos
    })


    await userCopper.save()


    res.json({
      ok: true,
      userCopper
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarUserCopper UserCopper
const actualizarUserCopper = async (req, res = response) => {
  //Validar token y comporbar si es el suserCopper
  const uid = req.params.id
  try {
    const userCopperDB = await UserCopper.findById(uid)
    if (!userCopperDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un userCopper',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!userCopperDB.google) {
      campos.email = email
    } else if (userCopperDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El userCopper de Google  no se puede actualizar',
      })
    }


    const userCopperActualizado = await UserCopper.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      userCopperActualizado,
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
    const userCopperDB = await UserCopper.findById(uid)
    if (!userCopperDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un userCopper',
      })
    }
    const campos = req.body
    campos.activated = !userCopperDB.activated
    const userCopperActualizado = await UserCopper.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      userCopperActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getUserCopperById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const userCopperDB = await UserCopper.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!userCopperDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un userCopper',
      })
    }
    res.json({
      ok: true,
      userCopper: userCopperDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getUserCopperByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const userCopperDB = await UserCopper.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!userCopperDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un userCopper',
      })
    }
    res.json({
      ok: true,
      userCopper: userCopperDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getUserCopperForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const userCopperDB = await UserCopper.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!userCopperDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un userCopper',
      })
    }
    res.json({
      ok: true,
      userCoppers: userCopperDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getUserCoppers,
  crearUserCopper,
  actualizarUserCopper,
  isActive,
  getUserCopperById,
  getAllUserCoppers,
  getUserCopperForSln,
  getUserCopperByClave
}
