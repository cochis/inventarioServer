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
} = require("../controllers/solicitudViaje");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getSolicitudViajes);
router.get("/all", validarJWT, getAllSolicitudViajes);
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
    check("tipoSolicitudViaje", "El tipo de solicitudViaje es obligatorio").not().isEmpty(),
 
 


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarSolicitudViaje
);
router.put(
  "/registro/:id",
  [

    check("fiesta", "La fiesta es obligatoria").not().isEmpty(),


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
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
