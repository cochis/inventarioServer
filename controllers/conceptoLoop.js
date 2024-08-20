const { response } = require('express')
const bcrypt = require('bcryptjs')
const ConceptoLoop = require('../models/conceptoLoop')
const { generarJWT } = require('../helpers/jwt')
//getConceptoLoops ConceptoLoop
const getConceptoLoops = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [conceptoLoops, total] = await Promise.all([
      ConceptoLoop.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      ConceptoLoop.countDocuments(),
    ])

    res.json({
      ok: true,
      conceptoLoops,
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
  const [conceptoLoops, total] = await Promise.all([
    ConceptoLoop.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    ConceptoLoop.countDocuments(),
  ])

  res.json({
    ok: true,
    conceptoLoops,
    uid: req.uid,
    total,
  })
}
const getAllConceptoLoops = async (req, res) => {

  try {
    const [conceptoLoops, total] = await Promise.all([
      ConceptoLoop.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      ConceptoLoop.countDocuments(),
    ])


    res.json({
      ok: true,
      conceptoLoops,
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

//crearConceptoLoop ConceptoLoop
const crearConceptoLoop = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const conceptoLoop = new ConceptoLoop({
      ...campos
    })


    await conceptoLoop.save()


    res.json({
      ok: true,
      conceptoLoop
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarConceptoLoop ConceptoLoop
const actualizarConceptoLoop = async (req, res = response) => {
  //Validar token y comporbar si es el sconceptoLoop
  const uid = req.params.id
  try {
    const conceptoLoopDB = await ConceptoLoop.findById(uid)
    if (!conceptoLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un conceptoLoop',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!conceptoLoopDB.google) {
      campos.email = email
    } else if (conceptoLoopDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El conceptoLoop de Google  no se puede actualizar',
      })
    }


    const conceptoLoopActualizado = await ConceptoLoop.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      conceptoLoopActualizado,
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
    const conceptoLoopDB = await ConceptoLoop.findById(uid)
    if (!conceptoLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un conceptoLoop',
      })
    }
    const campos = req.body
    campos.activated = !conceptoLoopDB.activated
    const conceptoLoopActualizado = await ConceptoLoop.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      conceptoLoopActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getConceptoLoopById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const conceptoLoopDB = await ConceptoLoop.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!conceptoLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un conceptoLoop',
      })
    }
    res.json({
      ok: true,
      conceptoLoop: conceptoLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getConceptoLoopByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const conceptoLoopDB = await ConceptoLoop.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!conceptoLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un conceptoLoop',
      })
    }
    res.json({
      ok: true,
      conceptoLoop: conceptoLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getConceptoLoopForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const conceptoLoopDB = await ConceptoLoop.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!conceptoLoopDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un conceptoLoop',
      })
    }
    res.json({
      ok: true,
      conceptoLoops: conceptoLoopDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getConceptoLoops,
  crearConceptoLoop,
  actualizarConceptoLoop,
  isActive,
  getConceptoLoopById,
  getAllConceptoLoops,
  getConceptoLoopForSln,
  getConceptoLoopByClave
}
