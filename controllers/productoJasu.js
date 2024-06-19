const { response } = require('express')
const bcrypt = require('bcryptjs')
const ProductoJasu = require('../models/productoJasu')
const { generarJWT } = require('../helpers/jwt')
//getProductoJasus ProductoJasu
const getProductoJasus = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    ProductoJasu.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ProductoJasu.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getMyProductoJasus = async (req, res) => {
  const uid = req.params.uid
 const [productoJasus, total] = await Promise.all([
    ProductoJasu.find({usuarioCreated: uid})
    .populate('tipoProductoJasu')
    .populate('estado')
     
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    ProductoJasu.countDocuments(),
  ])
 

  res.json({
    ok: true,
    productoJasus,
    uid: req.uid,
    total,
  })
}
const getAllProductoJasus = async (req, res) => {
 const [productoJasus, total] = await Promise.all([
    ProductoJasu.find({})
 
   
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    ProductoJasu.countDocuments(),
  ])
 

  res.json({
    ok: true,
    productoJasus,
    uid: req.uid,
    total,
  })
}

//crearProductoJasu ProductoJasu
const crearProductoJasu = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const productoJasu = new ProductoJasu({
      ...campos
    })


    await productoJasu.save()


    res.json({
      ok: true,
      productoJasu
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarProductoJasu ProductoJasu
const actualizarProductoJasu = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await ProductoJasu.findById(uid)
 
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
     


    const tipostockActualizado = await ProductoJasu.findByIdAndUpdate(uid, req.body, {
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
const dropProductosJasu = async (req, res = response) => {
  try {
  await ProductoJasu.drop()
    
    res.json({
      ok: true,
    
      msg:'Limpieza tabla',
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
      error:error
    })
  }
}
 


const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const tipostockDB = await ProductoJasu.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await ProductoJasu.findByIdAndUpdate(uid, campos, {
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

const getProductoJasuById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await ProductoJasu.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      productoJasu: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getProductoJasus,
  crearProductoJasu,
  actualizarProductoJasu,
  isActive,
  getProductoJasuById,
  getAllProductoJasus,
  getMyProductoJasus,
  dropProductosJasu

}
