const { response } = require('express')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const Usuario = require('../models/usuario')
 
const Role = require('../models/role')
const Stock = require('../models/stock')
 


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
  //console.log('busqueda', busqueda)
  const tabla = req.params.tabla
  //console.log('tabla', tabla)
  const admin = req.params.admin
  //console.log('admin', admin)
  const uid = req.uid
  //console.log('uid', uid)
 


  const regex = new RegExp(busqueda, 'i')
  //console.log('regex', regex)


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
