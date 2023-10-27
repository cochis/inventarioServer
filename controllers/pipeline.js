const { response } = require('express')
const bcrypt = require('bcryptjs')
const Pipeline = require('../models/pipeline')
const { generarJWT } = require('../helpers/jwt')
//getPipelines Pipeline
const getPipelines = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [pipelines, total] = await Promise.all([
      Pipeline.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Pipeline.countDocuments(),
    ])

    res.json({
      ok: true,
      pipelines,
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
  const [pipelines, total] = await Promise.all([
    Pipeline.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Pipeline.countDocuments(),
  ])

  res.json({
    ok: true,
    pipelines,
    uid: req.uid,
    total,
  })
}
const getAllPipelines = async (req, res) => {

  try {
    const [pipelines, total] = await Promise.all([
      Pipeline.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Pipeline.countDocuments(),
    ])


    res.json({
      ok: true,
      pipelines,
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

//crearPipeline Pipeline
const crearPipeline = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const pipeline = new Pipeline({
      ...campos
    })


    await pipeline.save()


    res.json({
      ok: true,
      pipeline
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarPipeline Pipeline
const actualizarPipeline = async (req, res = response) => {
  //Validar token y comporbar si es el spipeline
  const uid = req.params.id
  try {
    const pipelineDB = await Pipeline.findById(uid)
    if (!pipelineDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pipeline',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!pipelineDB.google) {
      campos.email = email
    } else if (pipelineDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El pipeline de Google  no se puede actualizar',
      })
    }


    const pipelineActualizado = await Pipeline.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      pipelineActualizado,
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
    const pipelineDB = await Pipeline.findById(uid)
    if (!pipelineDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pipeline',
      })
    }
    const campos = req.body
    campos.activated = !pipelineDB.activated
    const pipelineActualizado = await Pipeline.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      pipelineActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getPipelineById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pipelineDB = await Pipeline.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!pipelineDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pipeline',
      })
    }
    res.json({
      ok: true,
      pipeline: pipelineDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getPipelineByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const pipelineDB = await Pipeline.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!pipelineDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pipeline',
      })
    }
    res.json({
      ok: true,
      pipeline: pipelineDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getPipelineForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const pipelineDB = await Pipeline.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!pipelineDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un pipeline',
      })
    }
    res.json({
      ok: true,
      pipelines: pipelineDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getPipelines,
  crearPipeline,
  actualizarPipeline,
  isActive,
  getPipelineById,
  getAllPipelines,
  getPipelineForSln,
  getPipelineByClave
}
