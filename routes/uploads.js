/*
Ruta : api/uploads/:busqueda
*/

const { Router } = require('express')
const expressFileUpload = require('express-fileupload') 

const { validarJWT } = require('../middlewares/validar-jwt')

const { fileUpload, fileUploadAbasto,retornaImagen,fileUploadPago } = require('../controllers/uploads')
const router = Router()

router.use(expressFileUpload())
router.put('/:tipo/:id', validarJWT, fileUpload)
router.get('/:tipo/:foto', retornaImagen)
router.put('/pago-programado/:tipoArchivo/:id', validarJWT, fileUploadPago)
router.put('/:tipo/:id/:tipoAbasto/:idAbasto', validarJWT, fileUploadAbasto)

module.exports = router
