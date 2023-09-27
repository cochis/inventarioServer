/*
Ruta : api/tipostocks
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getEstadoTickets,
  crearEstadoTicket,
  actualizarEstadoTicket,
  isActive,
  getEstadoTicketById,
  getAllEstadoTickets 
} = require("../controllers/EstadoTicket");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getEstadoTickets);
router.get("/all", validarJWT, getAllEstadoTickets);
router.get("/:uid", validarJWT, getEstadoTicketById);
 
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),
    


    validarCampos,
  ],
  crearEstadoTicket
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarEstadoTicket
);


router.put(
  "/isActive/:id",
  [
    validarJWT,
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  isActive
);


module.exports = router;
