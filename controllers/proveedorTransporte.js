const { response } = require('express')
const bcrypt = require('bcryptjs')
const ProveedorTransporte = require('../models/proveedorTransporte')
const { generarJWT } = require('../helpers/jwt')
//getProveedorTransportes ProveedorTransporte
const getProveedorTransportes = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [proveedorTransportes, total] = await Promise.all([
      ProveedorTransporte.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      ProveedorTransporte.countDocuments(),
    ])

    res.json({
      ok: true,
      proveedorTransportes,
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
  const [proveedorTransportes, total] = await Promise.all([
    ProveedorTransporte.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ProveedorTransporte.countDocuments(),
  ])

  res.json({
    ok: true,
    proveedorTransportes,
    uid: req.uid,
    total,
  })
}
const getAllProveedorTransportes = async (req, res) => {

  try {
    const [proveedorTransportes, total] = await Promise.all([
      ProveedorTransporte.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      ProveedorTransporte.countDocuments(),
    ])


    res.json({
      ok: true,
      proveedorTransportes,
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

//crearProveedorTransporte ProveedorTransporte
const crearProveedorTransporte = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const proveedorTransporte = new ProveedorTransporte({
      ...campos
    })


    await proveedorTransporte.save()


    res.json({
      ok: true,
      proveedorTransporte
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarProveedorTransporte ProveedorTransporte
const actualizarProveedorTransporte = async (req, res = response) => {
  //Validar token y comporbar si es el sproveedorTransporte
  const uid = req.params.id
  try {
    const proveedorTransporteDB = await ProveedorTransporte.findById(uid)
    if (!proveedorTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorTransporte',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!proveedorTransporteDB.google) {
      campos.email = email
    } else if (proveedorTransporteDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El proveedorTransporte de Google  no se puede actualizar',
      })
    }


    const proveedorTransporteActualizado = await ProveedorTransporte.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorTransporteActualizado,
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
    const proveedorTransporteDB = await ProveedorTransporte.findById(uid)
    if (!proveedorTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorTransporte',
      })
    }
    const campos = req.body
    campos.activated = !proveedorTransporteDB.activated
    const proveedorTransporteActualizado = await ProveedorTransporte.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorTransporteActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getProveedorTransporteById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const proveedorTransporteDB = await ProveedorTransporte.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!proveedorTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorTransporte',
      })
    }
    res.json({
      ok: true,
      proveedorTransporte: proveedorTransporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getProveedorTransporteByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const proveedorTransporteDB = await ProveedorTransporte.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!proveedorTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorTransporte',
      })
    }
    res.json({
      ok: true,
      proveedorTransporte: proveedorTransporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getProveedorTransporteForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const proveedorTransporteDB = await ProveedorTransporte.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!proveedorTransporteDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorTransporte',
      })
    }
    res.json({
      ok: true,
      proveedorTransportes: proveedorTransporteDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getProveedorTransportes,
  crearProveedorTransporte,
  actualizarProveedorTransporte,
  isActive,
  getProveedorTransporteById,
  getAllProveedorTransportes,
  getProveedorTransporteForSln,
  getProveedorTransporteByClave
}
