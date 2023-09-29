const { response } = require('express')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const Usuario = require('../models/usuario')
 
const Role = require('../models/role')
const Stock = require('../models/stock')
const Ticket = require('../models/ticket')
 


//getCiclos Ciclo
const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda
  const regex = new RegExp(busqueda, 'i')

  const [usuarios, maestros, alumnos, padres, cursos] = await Promise.all([
    Usuario.find({
      nombre: regex,
    })
  ])
  res.json({
    ok: true,
    busqueda,
    uid: req.uid,
    usuarios
  })
}
const getDocumentosColeccion = async (req, res = response) => {
  const busqueda = req.params.busqueda
  const tabla = req.params.tabla
  const admin = req.params.admin
  const uid = req.uid
  const regex = new RegExp(busqueda, 'i')
  let data = []
  switch (tabla) {
    case 'usuarios':
      if (admin === 'false') {
        data = await Usuario.find(
          {
            $and: [
              {
                $or: [
                  { nombre: regex },
                  { apellidoPaterno: regex },
                  { apellidoMaterno: regex }
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        )
        .populate('role' ,'nombre _id')
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')

      } else {
        data = await Usuario.find(
          {
            $or: [
              { nombre: regex },
              { apellidoPaterno: regex },
              { apellidoMaterno: regex }
            ]
          }
        )
        .populate('role' ,'nombre _id')
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'tickets':
      if (admin === 'false') {
        data = await Ticket.find(
          {
            $and: [
              {
                $or: [
                  { descripcion: regex },
                  { respuesta: regex } 
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        )
        .populate('estado' ,'nombre _id')
        .populate('tipoTicket' ,'nombre _id')
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')

      } else {
        data = await Ticket.find(
          {
            $or: [
              { descripcion: regex },
                  { respuesta: regex } 
            ]
          }
        )
        .populate('estado' ,'nombre clave uid')
        .populate('tipoTicket' ,'nombre clave uid')
        .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
        .populate('usuarioAtendio', 'nombre apellidoPaterno apellidoMaterno email _id')
      }
      break
    case 'stocks':
      if (admin === 'false') {
        data = await Stock.find(
          {
            $and: [
              {
                $or: [
                  { clave: regex },
                  { modelo: regex },
                  { serie: regex },
                  { img: regex } 
                ]
              },
              { "usuarioCreated": uid }
            ]
          }
        ).populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      } else {
        data = await Stock.find(
          {
            $or: [
              { clave: regex },
              { modelo: regex },
              { serie: regex },
              { img: regex } 
            ]
          }
        )  .populate('usuarioCreated')
        .populate('tipoStock')
        .populate('usuarioAsignado')
      }
      break
     default:
      res.status(400).json({
        ok: false,
        msg: 'No se encontro  la tabla',
      })
  }

  res.json({
    ok: true,
    busqueda,
    uid: req.uid,
    resultados: data,
  })
}
const getDocumentosColeccionCatalogo = async (req, res = response) => {
  const busqueda = req.params.busqueda
  const tabla = req.params.tabla
  const regex = new RegExp(busqueda, 'i')


  let data = []
  switch (tabla) {
    case 'usuarios':
      data = await Usuario.find({
        $or: [

          { role: busqueda },
          { salon: busqueda },


        ],
      })    .populate('role' ,'nombre _id')
      .populate('usuarioCreated', 'nombre apellidoPaterno apellidoMaterno email _id')
      break
    case 'usuarios-rol':
      data = await Usuario.find({
        $or: [

          { role: busqueda },
        


        ],
      })
      .populate('role')
      .populate('usuarioCreated')
      break
    case 'stocks':
      data = await Stock.find({
        $or: [

          { tipoStock: busqueda },
          


        ],
      })
      .populate('usuarioCreated')
      .populate('tipoStock')
      .populate('usuarioAsignado')

      break
    case 'usuarios-ticket':

   
      data = await Ticket.find({
        $or: [

          { usuarioCreated: busqueda }, 
          


        ],
      })
      
      .populate('tipoTicket')
      .populate('estado')
      .populate('usuarioCreated')
      .populate('usuarioAtendio')
      

      break
    
    case 'tipoTicket-ticket':

   
      data = await Ticket.find({
        $or: [

          { tipoTicket: busqueda }, 
          


        ],
      })
      
      .populate('tipoTicket')
      .populate('estado')
      .populate('usuarioCreated')
      .populate('usuarioAtendio')
      

      break
    case 'estado-ticket':

   
      data = await Ticket.find({
        $or: [

          { estado: busqueda }, 
          


        ],
      })
      
      .populate('tipoTicket')
      .populate('estado')
      .populate('usuarioCreated')
      .populate('usuarioAtendio')
      

      break
    
      case 'stock-usuarioAsignado':
      data = await Stock.find({
        $or: [

          { usuarioAsignado: busqueda },
          


        ],
      })
      .populate('usuarioCreated')
      .populate('tipoStock')
      .populate('usuarioAsignado')

      break


    default:
      res.status(400).json({
        ok: false,
        msg: 'No se encontro  la tabla',
      })
  }

  res.json({
    ok: true,
    busqueda,
    uid: req.uid,
    resultados: data,
  })
}

module.exports = {
  getTodo,
  getDocumentosColeccion,
  getDocumentosColeccionCatalogo
}
