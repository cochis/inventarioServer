const { response } = require('express')
const bcrypt = require('bcryptjs')
const Destino = require('../models/destino')
const { generarJWT } = require('../helpers/jwt')
//getDestinos Destino
const getDestinos = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [destinos, total] = await Promise.all([
      Destino.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Destino.countDocuments(),
    ])

    res.json({
      ok: true,
      destinos,
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
  const [destinos, total] = await Promise.all([
    Destino.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Destino.countDocuments(),
  ])

  res.json({
    ok: true,
    destinos,
    uid: req.uid,
    total,
  })
}
const getAllDestinos = async (req, res) => {

  try {
    const [destinos, total] = await Promise.all([
      Destino.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Destino.countDocuments(),
    ])


    res.json({
      ok: true,
      destinos,
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

//crearDestino Destino
const crearDestino = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const destino = new Destino({
      ...campos
    })


    await destino.save()


    res.json({
      ok: true,
      destino
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarDestino Destino
const actualizarDestino = async (req, res = response) => {
  //Validar token y comporbar si es el sdestino
  const uid = req.params.id
  try {
    const destinoDB = await Destino.findById(uid)
    if (!destinoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un destino',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!destinoDB.google) {
      campos.email = email
    } else if (destinoDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El destino de Google  no se puede actualizar',
      })
    }


    const destinoActualizado = await Destino.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      destinoActualizado,
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
    const destinoDB = await Destino.findById(uid)
    if (!destinoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un destino',
      })
    }
    const campos = req.body
    campos.activated = !destinoDB.activated
    const destinoActualizado = await Destino.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      destinoActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getDestinoById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const destinoDB = await Destino.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!destinoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un destino',
      })
    }
    res.json({
      ok: true,
      destino: destinoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getDestinoByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const destinoDB = await Destino.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!destinoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un destino',
      })
    }
    res.json({
      ok: true,
      destino: destinoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getDestinoForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const destinoDB = await Destino.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!destinoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un destino',
      })
    }
    res.json({
      ok: true,
      destinos: destinoDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getDestinos,
  crearDestino,
  actualizarDestino,
  isActive,
  getDestinoById,
  getAllDestinos,
  getDestinoForSln,
  getDestinoByClave
}
