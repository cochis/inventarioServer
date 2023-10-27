const { response } = require('express')
const bcrypt = require('bcryptjs')
const Company = require('../models/company')
const { generarJWT } = require('../helpers/jwt')
//getCompanys Company
const getCompanys = async (req, res) => {

  try {
    const desde = Number(req.query.desde) || 0
    const cant = Number(req.query.cant) || 10
    const [companys, total] = await Promise.all([
      Company.find({})
        .sort({ nombre: 1 })
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .skip(desde)
        .limit(cant),
      Company.countDocuments(),
    ])

    res.json({
      ok: true,
      companys,
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
  const [companys, total] = await Promise.all([
    Company.find({})
      .sort({ nombre: 1 })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Company.countDocuments(),
  ])

  res.json({
    ok: true,
    companys,
    uid: req.uid,
    total,
  })
}
const getAllCompanys = async (req, res) => {

  try {
    const [companys, total] = await Promise.all([
      Company.find({})
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .sort({ nombre: 1 }),
      Company.countDocuments(),
    ])


    res.json({
      ok: true,
      companys,
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

//crearCompany Company
const crearCompany = async (req, res = response) => {

  const uid = req.uid
  const campos = {
    ...req.body,
    usuarioCreated:uid
  }

  try {


    const company = new Company({
      ...campos
    })


    await company.save()


    res.json({
      ok: true,
      company
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarCompany Company
const actualizarCompany = async (req, res = response) => {
  //Validar token y comporbar si es el scompany
  const uid = req.params.id
  try {
    const companyDB = await Company.findById(uid)
    if (!companyDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un company',
      })
    }
    const { password, google, email, ...campos } = req.body
    if (!companyDB.google) {
      campos.email = email
    } else if (companyDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'El company de Google  no se puede actualizar',
      })
    }


    const companyActualizado = await Company.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      companyActualizado,
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
    const companyDB = await Company.findById(uid)
    if (!companyDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un company',
      })
    }
    const campos = req.body
    campos.activated = !companyDB.activated
    const companyActualizado = await Company.findByIdAndUpdate(uid, campos, {
      new: true,
    })
    res.json({
      ok: true,
      companyActualizado,
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error:error
    })
  }
}

const getCompanyById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const companyDB = await Company.findById(uid)
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!companyDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un company',
      })
    }
    res.json({
      ok: true,
      company: companyDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCompanyByClave = async (req, res = response) => {
  const clave = req.params.clave
  try {
    const companyDB = await Company.find({ clave: clave })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!companyDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un company',
      })
    }
    res.json({
      ok: true,
      company: companyDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getCompanyForSln = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const companyDB = await Company.find({
      $or: [
        { "clave": "USRROL" },
        { "clave": "CHCROL" }
      ]
    })
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!companyDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un company',
      })
    }
    res.json({
      ok: true,
      companys: companyDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}



module.exports = {
  getCompanys,
  crearCompany,
  actualizarCompany,
  isActive,
  getCompanyById,
  getAllCompanys,
  getCompanyForSln,
  getCompanyByClave
}
