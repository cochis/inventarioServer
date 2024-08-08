const { response } = require('express')
const bcrypt = require('bcryptjs')
const ClienteLoop = require('../models/clienteLoop')
const { generarJWT } = require('../helpers/jwt')
//getClienteLoops ClienteLoop
const getClienteLoops = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [clienteLoops, total] = await Promise.all([
      ClienteLoop.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      ClienteLoop.countDocuments(),
    ])

    res.json({
      ok: true,
      clienteLoops,
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
  const [clienteLoops, total] = await Promise.all([
    ClienteLoop.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ClienteLoop.countDocuments(),
  ])

  res.json({
    ok: true,
    clienteLoops,
    uid: req.uid,
    total,
  })
}
const getAllClienteLoops = async (req, res) => {

  try {
    const [clienteLoops, total] = await Promise.all([
      ClienteLoop.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      ClienteLoop.countDocuments(),
    ])


    res.json({
      ok: true,
      clienteLoops,
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

//crearClienteLoop ClienteLoop
const crearClienteLoop = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const clienteLoop = new ClienteLoop({
      ...campos
    })


    await clienteLoop.save()


    res.json({
      ok: true,
      clienteLoop
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarClienteLoop ClienteLoop
const actualizarClienteLoop = async (req, res = response) => {
  //Validar token y comporbar si es el sclienteLoop
  const uid = req.params.id
  try {
    const clienteLoopDB = await ClienteLoop.findById(uid)
    if (!clienteLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un clienteLoop',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!clienteLoopDB.google) {
      campos.email = email
    } else if (clienteLoopDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El clienteLoop de Google  no se puede actualizar',
      })
    }


    const clienteLoopActualizado = await ClienteLoop.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      clienteLoopActualizado,
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
    const clienteLoopDB = await ClienteLoop.findById(uid)
    if (!clienteLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un clienteLoop',
      })
    }
    const campos = req.body
    campos.activated = !clienteLoopDB.activated
    const clienteLoopActualizado = await ClienteLoop.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      clienteLoopActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getClienteLoopById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const clienteLoopDB = await ClienteLoop.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!clienteLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un clienteLoop',
      })
    }
    res.json({
      ok: true,
      clienteLoop: clienteLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getClienteLoopByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const clienteLoopDB = await ClienteLoop.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!clienteLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un clienteLoop',
      })
    }
    res.json({
      ok: true,
      clienteLoop: clienteLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getClienteLoopForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const clienteLoopDB = await ClienteLoop.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!clienteLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un clienteLoop',
      })
    }
    res.json({
      ok: true,
      clienteLoops: clienteLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getClienteLoops,
  crearClienteLoop,
  actualizarClienteLoop,
  isActive,
  getClienteLoopById,
  getAllClienteLoops,
  getClienteLoopForSln,
  getClienteLoopByClave
}
