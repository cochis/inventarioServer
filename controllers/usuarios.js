const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')
//getUsuarios Usuario
const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [usuarios, total] = await Promise.all([
    Usuario.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
      .sort({ nombre: 1 })
      .skip(desde)
      .limit(cant),
    Usuario.countDocuments(),
  ])

  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  })
}
const getAllUsuarios = async (req, res) => {
  const [usuarios, total] = await Promise.all([
    Usuario.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
      .sort({ nombre: 1 }),
    Usuario.countDocuments(),
  ])

  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  })
}

//crearUsuario Usuario
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid

  try {
    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado',
      })
    }

    const usuario = new Usuario({
      ...req.body
    })

    //Encriptar contraseña

    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()
    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario)

    res.json({
      ok: true,
      usuario,
      token,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarUsuario Usuario
const actualizarUsuario = async (req, res = response) => {
  //Validar token y comporbar si es el susuario
  const uid = req.params.id
  try {
    const usuarioDB = await Usuario.findById(uid)
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!usuarioDB.google) {
      campos.email = email
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario de Google  no se puede actualizar',
      })
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      usuarioActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
      error:error,
    })
  }
}
//Actualizar Pass  Usuario
const actualizarPassUsuario = async (req, res = response) => {
  //Validar token y comporbar si es el susuario

  const uid = req.params.id
  try {
    const usuarioDB = await Usuario.findById(uid)

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const campos = req.body
    const salt = bcrypt.genSaltSync()
    campos.password = bcrypt.hashSync(campos.password, salt)
    let usuarioDB2 = {
      nombre: usuarioDB.nombre,
      apellidoPaterno: usuarioDB.apellidoPaterno,
      apellidoMaterno: usuarioDB.apellidoMaterno,
      email: usuarioDB.email,
      password: campos.password,
      img: usuarioDB.img,
      role: usuarioDB.role,
      google: usuarioDB.google,
      activated: usuarioDB.activated,
      dateCreated: usuarioDB.dateCreated,
      lastEdited: Date.now(),

    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, usuarioDB2, {
      new: true,
    })
    res.json({
      ok: true,
      usuarioActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
      error:error

    })
  }
}

const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const usuarioDB = await Usuario.findById(uid)
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    const campos = req.body
    campos.activated = !usuarioDB.activated
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      usuarioActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getUsuarioById = async (req, res = response) => {
  const uid = req.params.uid
 
  try {
    const usuarioDB = await Usuario.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getUsuarioByEmail = async (req, res = response) => {
  const email = req.params.email
  try {
    
    const usuarioDB = await Usuario.find({email:email})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getUsuarioByCreatedUid = async (req, res = response) => {
  const user = req.params.user
 
  try {
    const usuarioDB = await Usuario.find({ usuarioCreated: user })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('role', 'nombre clave _id')
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
 
    res.json({
      ok: true,
      usuarios: usuarioDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  isActive,
  getUsuarioById,
  getAllUsuarios,
  actualizarPassUsuario,
  getUsuarioByCreatedUid,
  getUsuarioByEmail
}
