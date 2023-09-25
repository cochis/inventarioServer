const { response } = require('express')
const bcrypt = require('bcryptjs')
const Stock = require('../models/stock')
const { generarJWT } = require('../helpers/jwt')
//getStocks Stock
const getStocks = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [stocks, total] = await Promise.all([
    Stock.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('usuarioAsignado', 'nombre apellidoPaterno apellidoMaterno email _id')
      .populate('tipoStock', 'nombre clave  _id')
      .skip(desde)
      .limit(cant),
    Stock.countDocuments(),
  ])

  res.json({
    ok: true,
    stocks,
    uid: req.uid,
    total,
  })
}
const getAllStocks = async (req, res) => {
  const [stocks, total] = await Promise.all([
    Stock.find({})
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('usuarioAsignado', 'nombre apellidoPaterno apellidoMaterno email _id')
    .populate('tipoStock', 'nombre clave  _id')
      .sort({ nombre: 1 }),
    Stock.countDocuments(),
  ])

  res.json({
    ok: true,
    stocks,
    uid: req.uid,
    total,
  })
}
//crearStock Stock
const crearStock = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated: req.uid
  }
  try {


    const stock = new Stock({
      ...campos
    })


    await stock.save()


    res.json({
      ok: true,
      stock
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
    })
  }
}
//actualizarStock Stock
const actualizarStock = async (req, res = response) => {
  //Validar token y comporbar si es el sstock
  const uid = req.params.id
  try {
    const stockDB = await Stock.findById(uid)
    if (!stockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un stock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!stockDB.google) {
      campos.email = email
    } else if (stockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El stock de Google  no se puede actualizar',
      })
    }


    const stockActualizado = await Stock.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      stockActualizado,
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const isActive = async (req, res = response) => {
  const uid = req.params.id
  try {
    const stockDB = await Stock.findById(uid)
    if (!stockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un stock',
      })
    }
    const campos = req.body
    campos.activated = !stockDB.activated
    const stockActualizado = await Stock.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      stockActualizado,
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}
const getStockById = async (req, res = response) => {
  const uid = req.params.uid
 
  try {
    const stockDB = await Stock.findById(uid).populate('tipoStock', 'nombre clave  _id')
   
    if (!stockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un stock',
      })
    }
    res.json({
      ok: true,
      stock: stockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
module.exports = {
  getStocks,
  crearStock,
  getAllStocks,
  actualizarStock,
  isActive,
  getStockById,

}
