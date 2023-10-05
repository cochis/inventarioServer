const { response } = require('express')
const bcrypt = require('bcryptjs')
const Incoterm = require('../models/incoterm')
const { generarJWT } = require('../helpers/jwt')
//getIncoterms Incoterm
const getIncoterms = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    Incoterm.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Incoterm.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getMyIncoterms = async (req, res) => {
  const uid = req.params.uid
 const [incoterms, total] = await Promise.all([
    Incoterm.find({usuarioCreated: uid})

    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Incoterm.countDocuments(),
  ])
 

  res.json({
    ok: true,
    incoterms,
    uid: req.uid,
    total,
  })
}
const getAllIncoterms = async (req, res) => {
 const [incoterms, total] = await Promise.all([
    Incoterm.find({})
 
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Incoterm.countDocuments(),
  ])
 

  res.json({
    ok: true,
    incoterms,
    uid: req.uid,
    total,
  })
}

//crearIncoterm Incoterm
const crearIncoterm = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const incoterm = new Incoterm({
      ...campos
    })


    await incoterm.save()


    res.json({
      ok: true,
      incoterm
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarIncoterm Incoterm
const actualizarIncoterm = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Incoterm.findById(uid)
 
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
     


    const tipostockActualizado = await Incoterm.findByIdAndUpdate(uid, req.body, {
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
const registrarAsistencia = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Incoterm.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await Incoterm.findByIdAndUpdate(uid, campos, {
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
      error:error
    })
  }
}
const confirmaIncoterm = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Incoterm.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipostockDB.google) {
      campos.email = email
    } else if (tipostockDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipostock de Google  no se puede actualizar',
      })
    }


    const tipostockActualizado = await Incoterm.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipostockActualizado,
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
    const tipostockDB = await Incoterm.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await Incoterm.findByIdAndUpdate(uid, campos, {
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

const getIncotermById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await Incoterm.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      incoterm: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getIncoterms,
  crearIncoterm,
  actualizarIncoterm,
  isActive,
  getIncotermById,
  getAllIncoterms,
  getMyIncoterms

}
