/*
Ruta : api/tipostocks
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoSolicitudViajes,
  crearTipoSolicitudViaje,
  actualizarTipoSolicitudViaje,
  isActive,
  getTipoSolicitudViajeById,
  getAllTipoSolicitudViajes 
} = require("../controllers/tipoSolicitudViaje");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getTipoSolicitudViajes);
router.get("/all", validarJWT, getAllTipoSolicitudViajes);
router.get("/:uid", validarJWT, getTipoSolicitudViajeById);
 
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),
    


    validarCampos,
  ],
  crearTipoSolicitudViaje
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
  actualizarTipoSolicitudViaje
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
