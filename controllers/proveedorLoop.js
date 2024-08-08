const { response } = require('express')
const bcrypt = require('bcryptjs')
const ProveedorLoop = require('../models/proveedorLoop')
const { generarJWT } = require('../helpers/jwt')
//getProveedorLoops ProveedorLoop
const getProveedorLoops = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [proveedorLoops, total] = await Promise.all([
      ProveedorLoop.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      ProveedorLoop.countDocuments(),
    ])

    res.json({
      ok: true,
      proveedorLoops,
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
  const [proveedorLoops, total] = await Promise.all([
    ProveedorLoop.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ProveedorLoop.countDocuments(),
  ])

  res.json({
    ok: true,
    proveedorLoops,
    uid: req.uid,
    total,
  })
}
const getAllProveedorLoops = async (req, res) => {

  try {
    const [proveedorLoops, total] = await Promise.all([
      ProveedorLoop.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      ProveedorLoop.countDocuments(),
    ])


    res.json({
      ok: true,
      proveedorLoops,
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

//crearProveedorLoop ProveedorLoop
const crearProveedorLoop = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const proveedorLoop = new ProveedorLoop({
      ...campos
    })


    await proveedorLoop.save()


    res.json({
      ok: true,
      proveedorLoop
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarProveedorLoop ProveedorLoop
const actualizarProveedorLoop = async (req, res = response) => {
  //Validar token y comporbar si es el sproveedorLoop
  const uid = req.params.id
  try {
    const proveedorLoopDB = await ProveedorLoop.findById(uid)
    if (!proveedorLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorLoop',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!proveedorLoopDB.google) {
      campos.email = email
    } else if (proveedorLoopDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El proveedorLoop de Google  no se puede actualizar',
      })
    }


    const proveedorLoopActualizado = await ProveedorLoop.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorLoopActualizado,
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
    const proveedorLoopDB = await ProveedorLoop.findById(uid)
    if (!proveedorLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorLoop',
      })
    }
    const campos = req.body
    campos.activated = !proveedorLoopDB.activated
    const proveedorLoopActualizado = await ProveedorLoop.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      proveedorLoopActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getProveedorLoopById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const proveedorLoopDB = await ProveedorLoop.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!proveedorLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorLoop',
      })
    }
    res.json({
      ok: true,
      proveedorLoop: proveedorLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getProveedorLoopByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const proveedorLoopDB = await ProveedorLoop.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!proveedorLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorLoop',
      })
    }
    res.json({
      ok: true,
      proveedorLoop: proveedorLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getProveedorLoopForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const proveedorLoopDB = await ProveedorLoop.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!proveedorLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un proveedorLoop',
      })
    }
    res.json({
      ok: true,
      proveedorLoops: proveedorLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getProveedorLoops,
  crearProveedorLoop,
  actualizarProveedorLoop,
  isActive,
  getProveedorLoopById,
  getAllProveedorLoops,
  getProveedorLoopForSln,
  getProveedorLoopByClave
}
