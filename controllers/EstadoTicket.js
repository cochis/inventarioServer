const { response } = require('express')
const bcrypt = require('bcryptjs')
const EstadoTicket = require('../models/estadoTicket')
const { generarJWT } = require('../helpers/jwt')
//getEstadoTickets EstadoTicket
const getEstadoTickets = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    EstadoTicket.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    EstadoTicket.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getAllEstadoTickets = async (req, res) => {
 const [estadoTickets, total] = await Promise.all([
    EstadoTicket.find({})
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    EstadoTicket.countDocuments(),
  ])
 

  res.json({
    ok: true,
    estadoTickets,
    uid: req.uid,
    total,
  })
}

//crearEstadoTicket EstadoTicket
const crearEstadoTicket = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }

 
  try {


    const tipostock = new EstadoTicket({
      ...campos
    })


    await tipostock.save()


    res.json({
      ok: true,
      tipostock
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarEstadoTicket EstadoTicket
const actualizarEstadoTicket = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await EstadoTicket.findById(uid)
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


    const tipostockActualizado = await EstadoTicket.findByIdAndUpdate(uid, campos, {
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
    const tipostockDB = await EstadoTicket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await EstadoTicket.findByIdAndUpdate(uid, campos, {
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
const confirmaEstadoTicket = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await EstadoTicket.findById(uid)
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


    const tipostockActualizado = await EstadoTicket.findByIdAndUpdate(uid, campos, {
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
    const tipostockDB = await EstadoTicket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await EstadoTicket.findByIdAndUpdate(uid, campos, {
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

const getEstadoTicketById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await EstadoTicket.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      estadoTicket: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getEstadoTickets,
  crearEstadoTicket,
  actualizarEstadoTicket,
  isActive,
  getEstadoTicketById,
  getAllEstadoTickets 

}
