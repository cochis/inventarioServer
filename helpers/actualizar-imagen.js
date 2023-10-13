const fs = require('fs')
const Usuario = require('../models/usuario')
const Stock = require('../models/stock')
const Ticket = require('../models/ticket')
const Abasto = require('../models/abasto')



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

    default:
      break
  }
}
const actualizarViaje = async (id, nombreArchivo,tipo, idViaje) => {
 
  console.log('actualizarViaje nombreArchivo', nombreArchivo)
  
  let pathViejo = ''
  const abasto = await Abasto.findById(id)
 
  if (!abasto) {
    return false
  }
 
  pathViejo = `./uploads/abastos/${abasto.viajes[ Number(idViaje)].tipo}`
 

  if (abasto.viajes[ Number(idViaje)].tipo && abasto.viajes[ Number(idViaje)].tipo !== '' ) {

    borrarImagen(pathViejo)
  }
 
  console.log('tipo', tipo)
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
