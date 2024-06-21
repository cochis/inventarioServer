/*
Ruta : api/solicitudViajes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getSolicitudViajes,
  crearSolicitudViaje,
  getAllSolicitudViajes,
  actualizarSolicitudViaje,
  isActive,
  getSolicitudViajeById,
  getSolicitudViajesNyEmpleado
} = require("../controllers/solicitudViaje");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getSolicitudViajes);
router.get("/all", validarJWT, getAllSolicitudViajes);
router.get("/user/:user", validarJWT, getSolicitudViajesNyEmpleado);
router.get("/:uid", validarJWT, getSolicitudViajeById);
 
 
 
router.post(
  "/",

  [
    validarJWT,
    check("tipoSolicitudViaje", "El tipo de solicitudViaje es obligatorio").not().isEmpty(),
 
    


    validarCampos,
  ],
  crearSolicitudViaje
);

router.put(
  "/:id",
  [
    validarJWT,
    check("dateViaje", "El tipo de dateViaje es obligatorio").not().isEmpty(),
    check("destino", "El   destino es obligatorio").not().isEmpty(),
    check("proposito", "El proposito de  es obligatorio").not().isEmpty(),
    check("medioTransporte", "El medioTransporte de  es obligatorio").not().isEmpty(),
    check("duracion", "La duracion de edición es obligatoria").not().isEmpty(),
    check("dateSalida", "La dateSalida de edición es obligatoria").not().isEmpty(),
    check("dateRegreso", "La dateRegreso de edición es obligatoria").not().isEmpty(),
    check("dateCreated", "La dateCreated de edición es obligatoria").not().isEmpty(),
    check("cantidadSolicitada", "La cantidadSolicitada de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarSolicitudViaje
);
router.put(
  "/registro/:id",
  [
    check("dateViaje", "El tipo de dateViaje es obligatorio").not().isEmpty(),
    check("destino", "El   destino es obligatorio").not().isEmpty(),
    check("proposito", "El proposito de  es obligatorio").not().isEmpty(),
    check("medioTransporte", "El medioTransporte de  es obligatorio").not().isEmpty(),
    check("duracion", "La duracion de edición es obligatoria").not().isEmpty(),
    check("dateSalida", "La dateSalida de edición es obligatoria").not().isEmpty(),
    check("dateRegreso", "La dateRegreso de edición es obligatoria").not().isEmpty(),
    check("dateCreated", "La dateCreated de edición es obligatoria").not().isEmpty(),
    check("cantidadSolicitada", "La cantidadSolicitada de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarSolicitudViaje
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
