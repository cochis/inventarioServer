const { response } = require('express')
const bcrypt = require('bcryptjs')
const Factura = require('../models/factura')
const { generarJWT } = require('../helpers/jwt')
const solicitudViaje = require('../models/solicitudViaje')
//getFacturas Factura
const getFacturas = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const cant = Number(req.query.cant) || 10
  const [tipostocks, total] = await Promise.all([
    Factura.find({})
      .sort({ nombre: 1 })
      .populate('tipoFactura')
      .populate('moneda')
      .populate('solicitudViaje')
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .skip(desde)
      .limit(cant),
    Factura.countDocuments(),
  ])

  res.json({
    ok: true,
    tipostocks,
    uid: req.uid,
    total,
  })
}
const getMyFacturas = async (req, res) => {
  const uid = req.params.uid
 const [facturas, total] = await Promise.all([
    Factura.find({usuarioCreated: uid})
    .populate('tipoFactura')
      .populate('moneda')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Factura.countDocuments(),
  ])
 

  res.json({
    ok: true,
    facturas,
    uid: req.uid,
    total,
  })
}
const getAllFacturas = async (req, res) => {
 const [facturas, total] = await Promise.all([
    Factura.find({})
    .populate('tipoFactura')
    .populate('moneda')
    .populate('solicitudViaje')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      .sort({ nombre: 1 }),
    Factura.countDocuments(),
  ])
 

  res.json({
    ok: true,
    facturas,
    uid: req.uid,
    total,
  })
}

//crearFactura Factura
const crearFactura = async (req, res = response) => {
  const { email, password } = req.body
  const uid = req.uid
 
  const campos = {
    ...req.body 
   
  }

 
  try {


    const factura = new Factura({
      ...campos
    })


    await factura.save()


    res.json({
      ok: true,
      factura
    })
  } catch (error) {
   
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado...  revisar logs',
      error:error
    })
  }
}

//actualizarFactura Factura
const actualizarFactura = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Factura.findById(uid)
 
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
     


    const tipostockActualizado = await Factura.findByIdAndUpdate(uid, req.body, {
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
    const tipostockDB = await Factura.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const { ...campos } = req.body

    const tipostockActualizado = await Factura.findByIdAndUpdate(uid, campos, {
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
const confirmaFactura = async (req, res = response) => {
  //Validar token y comporbar si es el stipostock
  const uid = req.params.id
  try {
    const tipostockDB = await Factura.findById(uid)
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


    const tipostockActualizado = await Factura.findByIdAndUpdate(uid, campos, {
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
    const tipostockDB = await Factura.findById(uid)
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    const campos = req.body
    campos.activated = !tipostockDB.activated
    const tipostockActualizado = await Factura.findByIdAndUpdate(uid, campos, {
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

const getFacturaById = async (req, res = response) => {
  const uid = req.params.uid
  try {
    const tipostockDB = await Factura.findById(uid)
    .populate('tipoFactura')
    .populate('moneda')
    .populate('solicitudViaje')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!tipostockDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exite un tipostock',
      })
    }
    res.json({
      ok: true,
      factura: tipostockDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
const getFacturaBySolicitud = async (req, res = response) => {
  const solicitud = req.params.solicitud
 
  try {
    const facturasDB = await Factura.find({
      solicitudViaje:solicitud
    })
    .populate('tipoFactura')
    .populate('moneda')
    .populate('solicitudViaje')
    .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
    if (!facturasDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No exiten facturas de esa solicitud',
      })
    }
    res.json({
      ok: true,
      facturas: facturasDB,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',error:error,
    })
  }
}
 

 

module.exports = {
  getFacturas,
  crearFactura,
  actualizarFactura,
  isActive,
  getFacturaById,
  getAllFacturas,
  getMyFacturas,
  getFacturaBySolicitud

}
