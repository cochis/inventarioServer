const { response } = require('express')
const bcrypt = require('bcryptjs')
const PagosTermino = require('../models/pagosTermino')
const { generarJWT } = require('../helpers/jwt')
//getPagosTerminos PagosTermino
const getPagosTerminos = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    PagosTermino.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    PagosTermino.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getMyPagosTerminos = async (req, res) => {
  const uid = req.params.uid
 const [pagosTerminos, total] = await Promise.all([
    PagosTermino.find({usuarioCreated: uid})
    .populate('tipoPagosTermino')
    .populate('estado')
    .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    PagosTermino.countDocuments(),
  ])
 

  res.json({
    ok: true,
    pagosTerminos,
    uid: req.uid,
    total,
  })
}
const getAllPagosTerminos = async (req, res) => {
 const [pagosTerminos, total] = await Promise.all([
    PagosTermino.find({})
    .populate('tipoPagosTermino')
    .populate('estado')
    .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    PagosTermino.countDocuments(),
  ])
 

  res.json({
    ok: true,
    pagosTerminos,
    uid: req.uid,
    total,
  })
}

//crearPagosTermino PagosTermino
const crearPagosTermino = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const pagosTermino = new PagosTermino({
      ...campos
    })


    await pagosTermino.save()


    res.json({
      ok: true,
      pagosTermino
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarPagosTermino PagosTermino
const actualizarPagosTermino = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await PagosTermino.findById(uid)
 
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
     


    const tipostockActualizado = await PagosTermino.findByIdAndUpdate(uid, req.body, {
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
    const tipostockDB = await PagosTermino.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await PagosTermino.findByIdAndUpdate(uid, campos, {
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
const confirmaPagosTermino = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await PagosTermino.findById(uid)
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


    const tipostockActualizado = await PagosTermino.findByIdAndUpdate(uid, campos, {
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
    const tipostockDB = await PagosTermino.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await PagosTermino.findByIdAndUpdate(uid, campos, {
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

const getPagosTerminoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await PagosTermino.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      pagosTermino: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getPagosTerminos,
  crearPagosTermino,
  actualizarPagosTermino,
  isActive,
  getPagosTerminoById,
  getAllPagosTerminos,
  getMyPagosTerminos

}
