const fs = require('fs')
const Usuario = require('../models/usuario')
const PagoProgramado = require('../models/pagoProgramado')
const Stock = require('../models/stock')
const Ticket = require('../models/ticket')
const Abasto = require('../models/abasto')
const Factura = require('../models/factura')
const DataEs = require('../models/specDataEs')



const borrarImagen = (path) => {

  if (fs.existsSync(path)) {
    
    fs.unlinkSync(path)
  }
}
const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = ''
  switch (tipo) {
    case 'usuarios':
      const usuario = await Usuario.findById(id)
      if (!usuario) {
        return false
      }
      pathViejo = `./uploads/usuarios/${usuario.img}`
      if (usuario.img && usuario.img !== '') {

        borrarImagen(pathViejo)
      }
      usuario.img = nombreArchivo
      await usuario.save()
      return true
      break
    case 'pagoProgramado':
      
      const pagoProgramado = await PagoProgramado.findById(id)
      if (!pagoProgramado) { 
        return false
      }
      pathViejo = `./uploads/pagoProgramado/${pagoProgramado.factura}`
      if (pagoProgramado.img && pagoProgramado.img !== '') {

        borrarImagen(pathViejo)
      }
      pagoProgramado.factura = nombreArchivo
      await pagoProgramado.save()
      return true
      break
    case 'stocks':

      const stock = await Stock.findById(id)
      if (!stock) {
        return false
      }
      pathViejo = `./uploads/stocks/${stock.img}`

      if (stock.img && stock.img !== '') {

        borrarImagen(pathViejo)
      }
      stock.img = nombreArchivo
      await stock.save()
      return true
      break
    case 'tickets':

      const ticket = await Ticket.findById(id)
      if (!ticket) {
        return false
      }
      pathViejo = `./uploads/tickets/${ticket.img}`

      if (ticket.img && ticket.img !== '') {

        borrarImagen(pathViejo)
      }
      ticket.img = nombreArchivo
      await ticket.save()
      return true
      break
    case 'facturas':

      const factura = await Factura.findById(id)
    
      if (!factura) {
        return false
      }
      pathViejo = `./uploads/facturas/${factura.file}`

      if (factura.file && factura.file !== '') {

        borrarImagen(pathViejo)
      }
      factura.file = nombreArchivo
      await factura.save()
      return true
      break
    case 'dataEs':

      const dataEs = await DataEs.findById(id)
      if (!dataEs) {
        return false
      }
      pathViejo = `./uploads/tickets/${dataEs.img}`

      if (dataEs.img && dataEs.img !== '') {

        borrarImagen(pathViejo)
      }
      dataEs.img = nombreArchivo
      await dataEs.save()
      return true
      break

    default:
      break
  }
}
const actualizarViaje = async (id, nombreArchivo,tipo, idViaje) => {
 
 
  
  let pathViejo = ''
  const abasto = await Abasto.findById(id)
 
  if (!abasto) {
    return false
  }
 
  
  if(tipo =='basculaOrigen'){

    pathViejo = `./uploads/abastos/${abasto.viajes[ Number(idViaje)].fotoTicketOrigen}`
    if(abasto.viajes[ Number(idViaje)].fotoTicketOrigen !== ''){

      borrarImagen(pathViejo)
    }
  }else {
    pathViejo = `./uploads/abastos/${abasto.viajes[ Number(idViaje)].fotoTicketDestino}`
    if(abasto.viajes[ Number(idViaje)].fotoTicketDestino !== ''){

      borrarImagen(pathViejo)
    }
  }
 
 
 
 

   
 
  if(tipo =='basculaOrigen'){
    abasto.viajes[ Number(idViaje)].fotoTicketOrigen= nombreArchivo
  } else if (tipo =='basculaDestino'){
    abasto.viajes[ Number(idViaje)].fotoTicketDestino= nombreArchivo
  }else{
    return false
  }
  await abasto.save()
  return true


}

module.exports = {
  actualizarImagen,
  actualizarViaje
}
