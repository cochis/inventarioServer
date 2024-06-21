const { response } = require('express')
const bcrypt = require('bcryptjs')
const SolicitudViaje = require('../models/solicitudViaje')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')
//getSolicitudViajes SolicitudViaje
const getSolicitudViajes = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [solicitudViajes, total] = await Promise.all([
    SolicitudViaje.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('tipoSolicitudViaje')
      .populate('moneda')
      .populate('tipoTransporte')
      .populate('empleado')
      .skip(desde)
      .limit(cant),
    SolicitudViaje.countDocuments(),
  ])

  res.json({
    ok: true,
    solicitudViajes,
    uid: req.uid,
    total,
  })
}
const getAllSolicitudViajes = async (req, res) => {
  const [solicitudViajes, total] = await Promise.all([
    SolicitudViaje.find({})
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('tipoSolicitudViaje')
      .populate('moneda')
      .populate('tipoTransporte')
      .populate('empleado')
      .sort({ nombre: 1 }),
    SolicitudViaje.countDocuments(),
  ])

  res.json({
    ok: true,
    solicitudViajes,
    uid: req.uid,
    total,
  })
}
const getSolicitudViajesNyEmpleado = async (req, res) => {
  const user = req.params.user
 
  const [solicitudViajes, total] = await Promise.all([
    SolicitudViaje.find({ usuarioCreated: user })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('tipoSolicitudViaje')
      .populate('moneda')
      .populate('tipoTransporte')
      .populate('empleado')
      .sort({ nombre: 1 }),
    SolicitudViaje.countDocuments(),
  ])

  res.json({
    ok: true,
    solicitudViajes,
    uid: req.uid,
    total,
  })
}
//crearSolicitudViaje SolicitudViaje
const crearSolicitudViaje = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }



  let idempleado = campos.empleado
  const usuarioDB = await Usuario.findById(idempleado)
  if (campos.url.includes("localhost")) {
    mails = `oramirez@jasu.us,${usuarioDB.email}`
    url = 'http://localhost:4200/core/edit-viaje/false'
  } else {
    mails = `rgranados@jasu.us,oramirez@jasu.us , accounting@jasu.us,${usuarioDB.email}`
    url = 'https://infra.jasu.us/core/edit-viaje/false'
  }

  try {


    const solicitudViaje = new SolicitudViaje({
      ...campos
    })


    await solicitudViaje.save()
    await transporter.sendMail({
      from: '"Solicitud de viaje" <sistemas@jasu.us>', // sender address
      to: mails, // list of receivers
      subject: `Solicitud de viaje ✈ de ${usuarioDB.nombre} ${usuarioDB.apellidoPaterno}   a ${campos.destino}`, // Subject line
      html: `
      <b>Solicitud de viaje </b>
      <br/>
      <span>
      <b>Empleado : </b> ${usuarioDB.nombre} ${usuarioDB.apellidoPaterno}
      </span> 
      <br/>
      <span>
      <b>Fecha de viaje  : </b> ${numberToDate(campos.dateViaje)}  
      </span> 
      <br/>
      <span>
      <b>Fecha de regreso  : </b> ${numberToDate(campos.dateRegreso)}  
      </span> 
      <br/>
      <span>
      <b>Cantidad solicitada : </b> ${campos.cantidadSolicitada}  
      </span> 
      <br/>
       <a href="${url}/${solicitudViaje._id}">Da click aqui para ver el viaje </a>
      `,
    });

    res.json({
      ok: true,
      solicitudViaje
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error: error
    })
  }
}
//actualizarSolicitudViaje SolicitudViaje
const actualizarSolicitudViaje = async (req, res = response) => {
  //Validar token y comporbar si es el ssolicitudViaje
  const { password, google, email, ...campos } = req.body
 

  var mails = ''
  var url = ''
  var act = ''
    act = campos.aprobado? 'Aprobada':'Aun no aprobada'
  let idempleado = campos.empleado
  const usuarioDB = await Usuario.findById(idempleado)
  if (campos.url.includes("localhost")) {
    mails = `oramirez@jasu.us,${usuarioDB.email}`
    url = 'http://localhost:4200/core/edit-viaje/false'
  } else {
    mails = `rgranados@jasu.us,oramirez@jasu.us , accounting@jasu.us,${usuarioDB.email}`
    url = 'https://infra.jasu.us/core/edit-viaje/false'
  }
 
  const uid = req.params.id
  try {
    const solicitudViajeDB = await SolicitudViaje.findById(uid)
    if (!solicitudViajeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un solicitudViaje',
      })
    }

    if (!solicitudViajeDB.google) {
      campos.email = email
    } else if (solicitudViajeDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El solicitudViaje de Google  no se puede actualizar',
      })
    }


    const solicitudViajeActualizado = await SolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })
   

    await transporter.sendMail({
      from: '"Solicitud de viaje" <sistemas@jasu.us>', // sender address
      to: mails, // list of receivers
      subject: `Solicitud de viaje Editada ✈ de ${usuarioDB.nombre} ${usuarioDB.apellidoPaterno}   a ${solicitudViajeActualizado.destino} Actualizada`, // Subject line
      html: `
      <b>Solicitud de viaje </b>
      <br/>
      <span>
      <b>Empleado : </b> ${usuarioDB.nombre} ${usuarioDB.apellidoPaterno}
      </span> 
      <br/>
      <span>
      <b>Fecha de viaje  : </b> ${numberToDate(solicitudViajeActualizado.dateViaje)}  
      </span> 
      <br/>
      <span>
      <b>Fecha de regreso  : </b> ${numberToDate(solicitudViajeActualizado.dateRegreso)}  
      </span> 
      <br/>
      <span>
      <b>Cantidad solicitada : </b> ${solicitudViajeActualizado.cantidadSolicitada}  
      </span> 
      <br/>
      <span>
      <b>Estado : </b> ${act}  
      </span> 
      <br/>
       <a href="${url}/${solicitudViajeActualizado._id}">Da click aqui para ver el viaje </a>
      `,
    });
    res.json({
      ok: true,
      solicitudViajeActualizado,
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
    const solicitudViajeDB = await SolicitudViaje.findById(uid)
    if (!solicitudViajeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un solicitudViaje',
      })
    }
    const campos = req.body
    var act = ''
    act = campos.activated? 'Aprobada':'Desaprobada'
    campos.activated = !solicitudViajeDB.activated
    if (campos.url.includes("localhost")) {
      mails = `oramirez@jasu.us,${usuarioDB.email}`
      url = 'http://localhost:4200/core/edit-viaje/false'
      
    } else {
      mails = `rgranados@jasu.us,oramirez@jasu.us , accounting@jasu.us,${usuarioDB.email}`
      url = 'https://infra.jasu.us/core/edit-viaje/false'
    }





    const solicitudViajeActualizado = await SolicitudViaje.findByIdAndUpdate(uid, campos, {
      new: true,
    })


    await transporter.sendMail({
      from: '"Solicitud de viaje" <sistemas@jasu.us>', // sender address
      to: mails, // list of receivers
      subject: `Solicitud de viaje ✈ de ${usuarioDB.nombre} ${usuarioDB.apellidoPaterno}   a ${campos.destino} ${act}`, // Subject line
      html: `
      <b>Solicitud de viaje  ${act} </b>
      <br/>     
      `,
    });





    res.json({
      ok: true,
      solicitudViajeActualizado,
    })
  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error: error
    })
  }
}
const getSolicitudViajeById = async (req, res = response) => {
  const uid = req.params.uid

  try {
    const solicitudViajeDB = await SolicitudViaje.findById(uid).populate('tipoSolicitudViaje', 'nombre clave  _id')
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('tipoSolicitudViaje')
      .populate('moneda')
      .populate('tipoTransporte')
      .populate('empleado')

    if (!solicitudViajeDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un solicitudViaje',
      })
    }
    res.json({
      ok: true,
      solicitudViaje: solicitudViajeDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado', error: error,
    })
  }
}


function numberToDate(date) {
  let today = new Date(date)
  var m = today.getMonth() + 1
  var monthT = m.toString()
  var d = today.getDate()
  var dayT = today.getDate().toString()
  let dt
  if (d < 10) {
    dayT = '0' + d
  }
  if (m < 10) {
    monthT = '0' + m
  }
  dt = today.getFullYear() + '-' + monthT + '-' + dayT
  return dt
}
module.exports = {
  getSolicitudViajes,
  crearSolicitudViaje,
  getAllSolicitudViajes,
  actualizarSolicitudViaje,
  isActive,
  getSolicitudViajeById,
  getSolicitudViajesNyEmpleado

}
