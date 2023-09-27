const fs = require('fs')
const Usuario = require('../models/usuario')
const Stock = require('../models/stock')
const Ticket = require('../models/ticket')
 


const borrarImagen = (path) => {
//console.log('path::: ', path);
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
}
const actualizarImagen = async (tipo, id, nombreArchivo) => {
  console.log('nombreArchivo', nombreArchivo)
  console.log('id', id)
  console.log('tipo', tipo)
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
      console.log('entro');
      const stock = await Stock.findById(id)
      if (!stock) {
        return false
      }
      pathViejo = `./uploads/stocks/${stock.img}`
      console.log('pathViejo', pathViejo)
      if (stock.img && stock.img !== '') {

        borrarImagen(pathViejo)
      }
      stock.img = nombreArchivo
      await stock.save()
      return true
      break
    case 'tickets':
      console.log('entro');
      const ticket = await Ticket.findById(id)
      if (!ticket) {
        return false
      }
      pathViejo = `./uploads/tickets/${ticket.img}`
      console.log('pathViejo', pathViejo)
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

module.exports = {
  actualizarImagen,
}
