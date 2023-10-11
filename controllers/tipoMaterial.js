const { response } = require('express')
const bcrypt = require('bcryptjs')
const TipoMaterial = require('../models/tipoMaterial')
const { generarJWT } = require('../helpers/jwt')
//getTipoMaterials TipoMaterial
const getTipoMaterials = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [tipoMaterials, total] = await Promise.all([
      TipoMaterial.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      TipoMaterial.countDocuments(),
    ])

    res.json({
      ok: true,
      tipoMaterials,
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
  const [tipoMaterials, total] = await Promise.all([
    TipoMaterial.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    TipoMaterial.countDocuments(),
  ])

  res.json({
    ok: true,
    tipoMaterials,
    uid: req.uid,
    total,
  })
}
const getAllTipoMaterials = async (req, res) => {

  try {
    const [tipoMaterials, total] = await Promise.all([
      TipoMaterial.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      TipoMaterial.countDocuments(),
    ])


    res.json({
      ok: true,
      tipoMaterials,
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

//crearTipoMaterial TipoMaterial
const crearTipoMaterial = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const tipoMaterial = new TipoMaterial({
      ...campos
    })


    await tipoMaterial.save()


    res.json({
      ok: true,
      tipoMaterial
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarTipoMaterial TipoMaterial
const actualizarTipoMaterial = async (req, res = response) => {
  //Validar token y comporbar si es el stipoMaterial
  const uid = req.params.id
  try {
    const tipoMaterialDB = await TipoMaterial.findById(uid)
    if (!tipoMaterialDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMaterial',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!tipoMaterialDB.google) {
      campos.email = email
    } else if (tipoMaterialDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El tipoMaterial de Google  no se puede actualizar',
      })
    }


    const tipoMaterialActualizado = await TipoMaterial.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoMaterialActualizado,
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
    const tipoMaterialDB = await TipoMaterial.findById(uid)
    if (!tipoMaterialDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMaterial',
      })
    }
    const campos = req.body
    campos.activated = !tipoMaterialDB.activated
    const tipoMaterialActualizado = await TipoMaterial.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      tipoMaterialActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getTipoMaterialById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoMaterialDB = await TipoMaterial.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoMaterialDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMaterial',
      })
    }
    res.json({
      ok: true,
      tipoMaterial: tipoMaterialDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoMaterialByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const tipoMaterialDB = await TipoMaterial.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoMaterialDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMaterial',
      })
    }
    res.json({
      ok: true,
      tipoMaterial: tipoMaterialDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getTipoMaterialForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipoMaterialDB = await TipoMaterial.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipoMaterialDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipoMaterial',
      })
    }
    res.json({
      ok: true,
      tipoMaterials: tipoMaterialDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getTipoMaterials,
  crearTipoMaterial,
  actualizarTipoMaterial,
  isActive,
  getTipoMaterialById,
  getAllTipoMaterials,
  getTipoMaterialForSln,
  getTipoMaterialByClave
}
