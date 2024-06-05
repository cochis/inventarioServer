const { response } = require('express')
const bcrypt = require('bcryptjs')
const PagoProgramado = require('../models/pagoProgramado')
const { generarJWT } = require('../helpers/jwt')
//getPagoProgramados PagoProgramado
const getPagoProgramados = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [pagoProgramados, total] = await Promise.all([
      PagoProgramado.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated' )
        .populate('subsidiaria' )
        .populate('terminoPago' )
        .populate('tipoGasto' )
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
      error:error
    })
  }
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [pagoProgramados, total] = await Promise.all([
    PagoProgramado.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated' )
      .populate('subsidiaria' )
      .populate('terminoPago' )
      .populate('tipoGasto' )
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
      .populate('usuarioCreated' )
      .populate('subsidiaria' )
      .populate('terminoPago' )
      .populate('tipoGasto' )
        .sort({ nombre: 1 }),
      PagoProgramado.countDocuments(),
    ])

    console.log('pagoProgramados', pagoProgramados)

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
    usuarioCreated:uid
  }

  try {


    const pagoProgramado = new PagoProgramado({
      ...campos
    })


    await pagoProgramado.save()


    res.json({
      ok: true,
      pagoProgramado
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
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
    if (!pagoProgramadoDB.google) {
      campos.email = email
    } else if (pagoProgramadoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El pagoProgramado de Google  no se puede actualizar',
      })
    }


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
      msg: 'Error inesperado',
      error:error,
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
      error:error
    })
  }
}

const getPagoProgramadoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pagoProgramadoDB = await PagoProgramado.findById(uid)
    .populate('usuarioCreated' )
    .populate('subsidiaria' )
    .populate('terminoPago' )
    .populate('tipoGasto' )
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
      msg: 'Error inesperado',error:error,
    })
  }
}
const getPagoProgramadoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const pagoProgramadoDB = await PagoProgramado.find({ clave: clave })
    .populate('usuarioCreated' )
    .populate('subsidiaria' )
    .populate('terminoPago' )
    .populate('tipoGasto' )
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
      msg: 'Error inesperado',error:error,
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
    .populate('usuarioCreated' )
    .populate('subsidiaria' )
    .populate('terminoPago' )
    .populate('tipoGasto' )
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
      msg: 'Error inesperado',error:error,
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
  getPagoProgramadoByClave
}
