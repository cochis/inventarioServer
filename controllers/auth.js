const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')
const { googleVerify } = require('../helpers/google-verify')
const { transporter } = require('../helpers/mailer')

const login = async (req, res = response) => {
  const { email, password } = req.body
  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email })
    .populate('role', 'nombre clave _id')
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email no encontrado',
      })
    }
    if (!usuarioDB.activated) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario desactivado',
      })
    }
 

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña no válida',
      })
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB)

    return res.json({
      ok: true,
      token,
      email: usuarioDB.email,
      role: usuarioDB.role,
      uid: usuarioDB._id,
    })
  } catch (error) {
   
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const loginGoogle = async (req, res = response) => {
  try {
    const token = req.body.token
    const { email, name, picture } = await googleVerify(token)

    const usuarioDB = await Usuario.findOne({ email })
    let usuario
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      })
    } else {
      usuario = usuarioDB
      usuario.google = true
    }
    await usuario.save()

    const tokenR = await generarJWT(usuario)
    return res.status(200).json({
      ok: true,
      msg: 'Loggin google',
      email,
      name,
      picture,
      token: tokenR,
    })
  } catch (error) {
   
    return res.status(400).json({
      ok: false,
      msg: 'Loggin de google no es correcto',
      error:error
    })
  }
}

const renewToken = async (req, res = response) => {
  const uid = req.uid

  // Generar el TOKEN - JWT
  const usuario = await Usuario.findById(uid)
  const token = await generarJWT(usuario)
  res.json({
    ok: true,
    token,
    usuario,
  })
}
const activeUser = async (req, res = response) => {
  const email = req.params.email.toLowerCase()

  try {
    const usuarioDB = await Usuario.find({ email: email })
    if (!usuarioDB || usuarioDB.length == 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    usuarioDB.activated = true
    const usuarioActualizado = await Usuario.findOneAndUpdate({ email }, { activated: true }, {
      new: true,
    })
    res.json({
      ok: true,
      activated: true,
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
const existUser = async (req, res = response) => {
  const email = req.params.email.toLowerCase()

  try {
    const usuarioDB = await Usuario.find({  email })
    if (!usuarioDB || usuarioDB.length == 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un usuario',
      })
    }
    
 
     
    
    let campos ={
      ...usuarioDB
    }
    campos._id= undefined
    campos.activated = true
    const usuario = await Usuario.findOneAndUpdate({ email }, campos, {
      new: true,
    })
    const token = await generarJWT(campos)
    await transporter.sendMail({
      from: '"Verificación de correo" <sistemas@jasu.us>', // sender address
      to: email , // list of receivers
      subject: "Verificación de correo ✔", // Subject line
      html: `
      <b>Por favor entra al siguiente link para verificar tu correo  </b>
     <a href="https://infra.jasu.us/auth/verification/${token}/${email}">Verifica Correo</a>
      `,
    });
     
      res.json({
        ok: true,
        exist: true,
        token: token,
        usuario
      })
   
     
   
    

   
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}
module.exports = { login, loginGoogle, renewToken, activeUser, existUser }
