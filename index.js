require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/config')
const path = require('path')
const https = require('https')
const fs = require('fs')
// Crear el servidor de express
const app = express()

// Configurar CORS
app.use(cors())
//Carpeta publoc

app.use('/', express.static('client', { redirect: false }))

app.use(express.static('public'))

//lectura y paseo del body
app.use(express.json())
// Base de datos
dbConnection()

// Rutas

app.use('/api/login', require('./routes/auth'))
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/role'))
app.use('/api/cargas', require('./routes/carga'))
app.use('/api/tipoCarga', require('./routes/tipoCarga'))
app.use('/api/asignacion', require('./routes/asignacion'))
app.use('/api/stock', require('./routes/stock'))
app.use('/api/tipoStock', require('./routes/tipoStock'))
app.use('/api/tipoProveedor', require('./routes/tipoProveedor'))
app.use('/api/tipoTicket', require('./routes/tipoTicket'))
app.use('/api/estadoTicket', require('./routes/estadoTicket'))
app.use('/api/ticket', require('./routes/ticket'))
app.use('/api/producto', require('./routes/producto'))
app.use('/api/zonas', require('./routes/zona'))
app.use('/api/proveedor', require('./routes/proveedor'))
app.use('/api/abastos', require('./routes/abasto'))
app.use('/api/incoterm', require('./routes/incoterm'))
app.use('/api/zona', require('./routes/zona'))
app.use('/api/origens', require('./routes/origen'))
app.use('/api/destinos', require('./routes/destino'))
app.use('/api/monedas', require('./routes/moneda'))
app.use('/api/unidadMedidas', require('./routes/unidadMedida'))
app.use('/api/tipoMaterials', require('./routes/tipoMaterial'))
app.use('/api/materiaPrimas', require('./routes/materiaPrima'))
app.use('/api/companias', require('./routes/compania'))
app.use('/api/proveedorTransportes', require('./routes/proveedorTransporte'))
// app.use('/api/pagos-terminos', require('./routes/pagosTermino'))
// app.use('/api/pais', require('./routes/pais'))
// app.use('/api/status', require('./routes/status'))
// app.use('/api/presentacion', require('./routes/presentacion'))
// app.use('/api/tipo', require('./routes/tipo'))
app.use('/api/upload', require('./routes/uploads'))
app.use('/api/search', require('./routes/busquedas'))
app.use('/api/transporte', require('./routes/transporte'))






app.get('*', function (req, res, next) {
  res.sendFile(path.resolve('client/index.html'))
})
app.listen(process.env.PORT, () => {
  console.log(
    '__________________________________________________________________________________________________',
  )
  console.log(
    '__________________________________________________________________________________________________',
  )
  console.log('Servidor corriendo en puerto ' + process.env.PORT)
})
