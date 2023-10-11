const { response } = require('express')
const bcrypt = require('bcryptjs')
const UnidadMedida = require('../models/unidadMedida')
const { generarJWT } = require('../helpers/jwt')
//getUnidadMedidas UnidadMedida
const getUnidadMedidas = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [unidadMedidas, total] = await Promise.all([
      UnidadMedida.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      UnidadMedida.countDocuments(),
    ])

    res.json({
      ok: true,
      unidadMedidas,
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
  const [unidadMedidas, total] = await Promise.all([
    UnidadMedida.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    UnidadMedida.countDocuments(),
  ])

  res.json({
    ok: true,
    unidadMedidas,
    uid: req.uid,
    total,
  })
}
const getAllUnidadMedidas = async (req, res) => {

  try {
    const [unidadMedidas, total] = await Promise.all([
      UnidadMedida.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      UnidadMedida.countDocuments(),
    ])


    res.json({
      ok: true,
      unidadMedidas,
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

//crearUnidadMedida UnidadMedida
const crearUnidadMedida = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const unidadMedida = new UnidadMedida({
      ...campos
    })


    await unidadMedida.save()


    res.json({
      ok: true,
      unidadMedida
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarUnidadMedida UnidadMedida
const actualizarUnidadMedida = async (req, res = response) => {
  //Validar token y comporbar si es el sunidadMedida
  const uid = req.params.id
  try {
    const unidadMedidaDB = await UnidadMedida.findById(uid)
    if (!unidadMedidaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un unidadMedida',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!unidadMedidaDB.google) {
      campos.email = email
    } else if (unidadMedidaDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El unidadMedida de Google  no se puede actualizar',
      })
    }


    const unidadMedidaActualizado = await UnidadMedida.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      unidadMedidaActualizado,
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
    const unidadMedidaDB = await UnidadMedida.findById(uid)
    if (!unidadMedidaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un unidadMedida',
      })
    }
    const campos = req.body
    campos.activated = !unidadMedidaDB.activated
    const unidadMedidaActualizado = await UnidadMedida.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      unidadMedidaActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getUnidadMedidaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const unidadMedidaDB = await UnidadMedida.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!unidadMedidaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un unidadMedida',
      })
    }
    res.json({
      ok: true,
      unidadMedida: unidadMedidaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getUnidadMedidaByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const unidadMedidaDB = await UnidadMedida.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!unidadMedidaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un unidadMedida',
      })
    }
    res.json({
      ok: true,
      unidadMedida: unidadMedidaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getUnidadMedidaForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const unidadMedidaDB = await UnidadMedida.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!unidadMedidaDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un unidadMedida',
      })
    }
    res.json({
      ok: true,
      unidadMedidas: unidadMedidaDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getUnidadMedidas,
  crearUnidadMedida,
  actualizarUnidadMedida,
  isActive,
  getUnidadMedidaById,
  getAllUnidadMedidas,
  getUnidadMedidaForSln,
  getUnidadMedidaByClave
}
