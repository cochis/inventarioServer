const { response } = require('express')
const bcrypt = require('bcryptjs')
const PagoProgramado = require('../models/pagoProgramado')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')

const Usuario = require('../models/usuario')


//getPagoProgramados PagoProgramado
const getPagoProgramados = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [pagoProgramados, total] = await Promise.all([
      PagoProgramado.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated')
        .populate('subsidiaria')
        .populate('terminoPago')
        .populate('tipoGasto')
        .populate('moneda')
        .skip(desde)
        .limit(cant),
      PagoProgramado.countDocuments(),
    ])

    res.json({
      ok: true,
      pagoProgramados,
      uid: req.uid,
      total,
    })
  } catch (error) {

    res.json({
      ok: false,
      error: error
    })
  }
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [pagoProgramados, total] = await Promise.all([
    PagoProgramado.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated')
      .populate('subsidiaria')
      .populate('terminoPago')
      .populate('tipoGasto')
      .populate('moneda')
      .skip(desde)
      .limit(cant),
    PagoProgramado.countDocuments(),
  ])

  res.json({
    ok: true,
    pagoProgramados,
    uid: req.uid,
    total,
  })
}
const getAllPagoProgramados = async (req, res) => {

  try {
    const [pagoProgramados, total] = await Promise.all([
      PagoProgramado.find({})
        .populate('moneda')
        .populate('usuarioCreated')
        .populate('subsidiaria')
        .populate('terminoPago')
        .populate('tipoGasto')
        .sort({ nombre: 1 }),
      PagoProgramado.countDocuments(),
    ])


    res.json({
      ok: true,
      pagoProgramados,
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
const getPagoProgramadosByUser = async (req, res) => {

  try {
    const user = req.params.user
    const [pagoProgramados, total] = await Promise.all([
      PagoProgramado.find({ usuarioCreated: user })
        .populate('moneda')
        .populate('usuarioCreated')
        .populate('subsidiaria')
        .populate('terminoPago')
        .populate('tipoGasto')
        .sort({ nombre: 1 }),
      PagoProgramado.countDocuments(),
    ])


    res.json({
      ok: true,
      pagoProgramados,
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

//crearPagoProgramado PagoProgramado
const crearPagoProgramado = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: uid
  }
 
  let idempleado = uid
  const usuarioDB = await Usuario.findById(idempleado)
  try {


    const pagoProgramado = new PagoProgramado({
      ...campos
    })
    var mails = ''
    if (campos.url.includes("localhost")) {
      mails = `oramirez@jasu.us,${usuarioDB.email}`
    } else {
      mails = `gfernandez@jasu.us,oramirez@jasu.us , accounting@jasu.us,${usuarioDB.email}`
    }


    await pagoProgramado.save()

    let subject = ''
    if (pagoProgramado.urgente) {
      subject = "Urgente Creación de pago programado  💰  favor de contactar con " + usuarioDB.email + " para validar detalles"
    } else {
      subject = "Urgente Creación de pago programado  💰 "
    }
    
    
    await transporter.sendMail({
      from: '"Creacion de pago programado" <sistemas@jasu.us>', // sender address
      // to: 'gfernandez@jasu.us,oramirez@jasu.us , accounting@jasu.us' , // list of receiverss
      to: mails, // list of receivers
      subject: subject, // Subject line
      html: `
      <b>Se creo un pago programado para  ${pagoProgramado.proveedor} </b>
      <br/>
      <b>Concepto:   ${pagoProgramado.concepto} </b>
      <br/>
      <b>Cantidad:   ${pagoProgramado.cantidad} </b>
      <br/>
      <a href="https://infra.jasu.us/core/pagos-programados/edit-pago-programado/true/${pagoProgramado._id}">Da click aqui para ver el pago </a>
      
      `,
    });



    res.json({
      ok: true,
      pagoProgramado
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error: error
    })
  }
}

//actualizarPagoProgramado PagoProgramado
const actualizarPagoProgramado = async (req, res = response) => {
  //Validar token y comporbar si es el spagoProgramado
  const uid = req.params.id
  try {
    const pagoProgramadoDB = await PagoProgramado.findById(uid)
    if (!pagoProgramadoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pagoProgramado',
      })
    }
    const { password, google, email, ...campos } = req.body
    act = campos.aprobacion ? 'Aprobada' : 'Aun no aprobada'
    if (!pagoProgramadoDB.google) {
      campos.email = email
    } else if (pagoProgramadoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El pagoProgramado de Google  no se puede actualizar',
      })
    }
    let idempleado = campos.usuarioCreated
    const usuarioDB = await Usuario.findById(idempleado)


    const pagoProgramadoActualizado = await PagoProgramado.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    var mails = ''
    if (campos.url.includes("localhost")) {
      mails = `oramirez@jasu.us,${usuarioDB.email}`
      url = 'http://localhost:4200/core/pagos-programados/edit-pago-programado/true/'
    } else {
      mails = `gfernandez@jasu.us,oramirez@jasu.us , accounting@jasu.us,${usuarioDB.email}`
      url = 'https://infra.jasu.us/core/pagos-programados/edit-pago-programado/true/'
    }


    await transporter.sendMail({
      from: '"Edición de pago programado" <sistemas@jasu.us>', // sender address
      // to: 'gfernandez@jasu.us,oramirez@jasu.us , accounting@jasu.us' , // list of receivers
      to: mails, // list of receivers
      subject: "Edición de pago programado 💰", // Subject line
      html: `
      <b>Se edito un pago programado para  ${pagoProgramadoActualizado.proveedor} </b>
      <br/>
      <b>Concepto:   ${pagoProgramadoActualizado.concepto} </b>
      <br/>
      <b>Cantidad:   ${pagoProgramadoActualizado.cantidad} </b>
      <br/>
      <b>Aprobado:   ${act} </b>
      <br/>
      <a href="https://infra.jasu.us/core/pagos-programados/edit-pago-programado/true/${uid}">Da click aqui para ver el pago </a>
      
      `,
    });
    res.json({
      ok: true,
      pagoProgramadoActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
      error: error,
    })
  }
}


const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const pagoProgramadoDB = await PagoProgramado.findById(uid)
    if (!pagoProgramadoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pagoProgramado',
      })
    }
    const campos = req.body
    campos.activated = !pagoProgramadoDB.activated
    const pagoProgramadoActualizado = await PagoProgramado.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      pagoProgramadoActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error: error
    })
  }
}

const getPagoProgramadoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pagoProgramadoDB = await PagoProgramado.findById(uid)
      .populate('usuarioCreated')
      .populate('subsidiaria')
      .populate('terminoPago')
      .populate('tipoGasto')
      .populate('moneda')
    if (!pagoProgramadoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pagoProgramado',
      })
    }
    res.json({
      ok: true,
      pagoProgramado: pagoProgramadoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
    })
  }
}
const getPagoProgramadoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const pagoProgramadoDB = await PagoProgramado.find({ clave: clave })
      .populate('usuarioCreated')
      .populate('subsidiaria')
      .populate('terminoPago')
      .populate('tipoGasto')
      .populate('moneda')
    if (!pagoProgramadoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pagoProgramado',
      })
    }
    res.json({
      ok: true,
      pagoProgramado: pagoProgramadoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
    })
  }
}
const getPagoProgramadoForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pagoProgramadoDB = await PagoProgramado.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated')
      .populate('subsidiaria')
      .populate('terminoPago')
      .populate('tipoGasto')
      .populate('moneda')
    if (!pagoProgramadoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pagoProgramado',
      })
    }
    res.json({
      ok: true,
      pagoProgramados: pagoProgramadoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
    })
  }
}



module.exports = {
  getPagoProgramados,
  crearPagoProgramado,
  actualizarPagoProgramado,
  isActive,
  getPagoProgramadoById,
  getAllPagoProgramados,
  getPagoProgramadoForSln,
  getPagoProgramadoByClave,
  getPagoProgramadosByUser
}
