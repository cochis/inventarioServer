const { response } = require('express')
const bcrypt = require('bcryptjs')
const Ticket = require('../models/ticket')
const { generarJWT } = require('../helpers/jwt')
//getTickets Ticket
const getTickets = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    Ticket.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Ticket.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getMyTickets = async (req, res) => {
  const uid = req.params.uid
 const [tickets, total] = await Promise.all([
    Ticket.find({usuarioCreated: uid})
    .populate('tipoTicket')
    .populate('estado')
    .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Ticket.countDocuments(),
  ])
 

  res.json({
    ok: true,
    tickets,
    uid: req.uid,
    total,
  })
}
const getAllTickets = async (req, res) => {
 const [tickets, total] = await Promise.all([
    Ticket.find({})
    .populate('tipoTicket')
    .populate('estado')
    .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Ticket.countDocuments(),
  ])
 

  res.json({
    ok: true,
    tickets,
    uid: req.uid,
    total,
  })
}

//crearTicket Ticket
const crearTicket = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const ticket = new Ticket({
      ...campos
    })


    await ticket.save()


    res.json({
      ok: true,
      ticket
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTicket Ticket
const actualizarTicket = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Ticket.findById(uid)
 
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
     


    const tipostockActualizado = await Ticket.findByIdAndUpdate(uid, req.body, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {
 
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Ticket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await Ticket.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
      error:error
    })
  }
}
const confirmaTicket = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Ticket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipostockDB.google) {
      campos.email = email
    } else if (tipostockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipostock de Google  no se puede actualizar',
      })
    }


    const tipostockActualizado = await Ticket.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
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
    const tipostockDB = await Ticket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await Ticket.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTicketById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await Ticket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      ticket: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getTickets,
  crearTicket,
  actualizarTicket,
  isActive,
  getTicketById,
  getAllTickets,
  getMyTickets

}
