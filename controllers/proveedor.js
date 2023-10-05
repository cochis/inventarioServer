const { response } = require('express')
const bcrypt = require('bcryptjs')
const Proveedor = require('../models/proveedor')
const { generarJWT } = require('../helpers/jwt')
//getProveedors Proveedor
const getProveedors = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [proveedorstocks, total] = await Promise.all([
    Proveedor.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Proveedor.countDocuments(),
  ])

  res.json({
    ok: true,
    proveedorstocks,
    uid: req.uid,
    total,
  })
}
const getMyProveedors = async (req, res) => {
  const uid = req.params.uid
 const [proveedors, total] = await Promise.all([
    Proveedor.find({usuarioCreated: uid})
    .populate('proveedorProveedor')
    .populate('estado')
    .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Proveedor.countDocuments(),
  ])
 

  res.json({
    ok: true,
    proveedors,
    uid: req.uid,
    total,
  })
}
const getAllProveedors = async (req, res) => {
 const [proveedors, total] = await Promise.all([
    Proveedor.find({})
    
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Proveedor.countDocuments(),
  ])
 

  res.json({
    ok: true,
    proveedors,
    uid: req.uid,
    total,
  })
}

//crearProveedor Proveedor
const crearProveedor = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const proveedor = new Proveedor({
      ...campos
    })


    await proveedor.save()


    res.json({
      ok: true,
      proveedor
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarProveedor Proveedor
const actualizarProveedor = async (req, res = response) => {
  //Validar token y comporbar si es el sproveedorstock
  const uid = req.params.id
  try {
    const proveedorstockDB = await Proveedor.findById(uid)
 
    if (!proveedorstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorstock',
      })
    }
     


    const proveedorstockActualizado = await Proveedor.findByIdAndUpdate(uid, req.body, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorstockActualizado,
    })
  } catch (error) {
 
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el sproveedorstock
  const uid = req.params.id
  try {
    const proveedorstockDB = await Proveedor.findById(uid)
    if (!proveedorstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorstock',
      })
    }
    const { ...campos } = req.body

    const proveedorstockActualizado = await Proveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorstockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
      error:error
    })
  }
}
const confirmaProveedor = async (req, res = response) => {
  //Validar token y comporbar si es el sproveedorstock
  const uid = req.params.id
  try {
    const proveedorstockDB = await Proveedor.findById(uid)
    if (!proveedorstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorstock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!proveedorstockDB.google) {
      campos.email = email
    } else if (proveedorstockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El proveedorstock de Google  no se puede actualizar',
      })
    }


    const proveedorstockActualizado = await Proveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorstockActualizado,
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
    const proveedorstockDB = await Proveedor.findById(uid)
    if (!proveedorstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorstock',
      })
    }
    const campos = req.body
    campos.activated = !proveedorstockDB.activated
    const proveedorstockActualizado = await Proveedor.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorstockActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getProveedorById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const proveedorstockDB = await Proveedor.findById(uid)
    if (!proveedorstockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorstock',
      })
    }
    res.json({
      ok: true,
      proveedor: proveedorstockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getProveedors,
  crearProveedor,
  actualizarProveedor,
  isActive,
  getProveedorById,
  getAllProveedors,
  getMyProveedors

}
