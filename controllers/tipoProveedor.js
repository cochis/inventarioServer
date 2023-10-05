const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoProveedor = require('../models/tipoProveedor')
const { generarJWT } = require('../helpers/jwt')
//getTipoProveedors TipoProveedor
const getTipoProveedors = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoProveedors, total] = await Promise.all([
      TipoProveedor.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TipoProveedor.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoProveedors,
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
  const [tipoProveedors, total] = await Promise.all([
    TipoProveedor.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoProveedor.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoProveedors,
    uid: req.uid,
    total,
  })
}
const getAllTipoProveedors = async (req, res) => {

  try {
    const [tipoProveedors, total] = await Promise.all([
      TipoProveedor.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TipoProveedor.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoProveedors,
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

//crearTipoProveedor TipoProveedor
const crearTipoProveedor = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const tipoProveedor = new TipoProveedor({
      ...campos
    })


    await tipoProveedor.save()


    res.json({
      ok: true,
      tipoProveedor
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoProveedor TipoProveedor
const actualizarTipoProveedor = async (req, res = response) => {
  //Validar token y comporbar si es el stipoProveedor
  const uid = req.params.id
  try {
    const tipoProveedorDB = await TipoProveedor.findById(uid)
    if (!tipoProveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoProveedor',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoProveedorDB.google) {
      campos.email = email
    } else if (tipoProveedorDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoProveedor de Google  no se puede actualizar',
      })
    }


    const tipoProveedorActualizado = await TipoProveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoProveedorActualizado,
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
    const tipoProveedorDB = await TipoProveedor.findById(uid)
    if (!tipoProveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoProveedor',
      })
    }
    const campos = req.body
    campos.activated = !tipoProveedorDB.activated
    const tipoProveedorActualizado = await TipoProveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoProveedorActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoProveedorById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoProveedorDB = await TipoProveedor.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoProveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoProveedor',
      })
    }
    res.json({
      ok: true,
      tipoProveedor: tipoProveedorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoProveedorByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoProveedorDB = await TipoProveedor.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoProveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoProveedor',
      })
    }
    res.json({
      ok: true,
      tipoProveedor: tipoProveedorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoProveedorForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoProveedorDB = await TipoProveedor.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoProveedorDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoProveedor',
      })
    }
    res.json({
      ok: true,
      tipoProveedors: tipoProveedorDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTipoProveedors,
  crearTipoProveedor,
  actualizarTipoProveedor,
  isActive,
  getTipoProveedorById,
  getAllTipoProveedors,
  getTipoProveedorForSln,
  getTipoProveedorByClave
}
