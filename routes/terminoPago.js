/*
Ruta : api/terminoPagos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTerminoPagos,
  crearTerminoPago,
  actualizarTerminoPago,
  isActive,
  getTerminoPagoById,
  getAllTerminoPagos,
  getTerminoPagoForSln,
  getTerminoPagoByClave
} = require("../controllers/terminoPago");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTerminoPagos);
router.get("/all", getAllTerminoPagos);
router.get("/all/salon", getTerminoPagoForSln);
router.get("/:uid", getTerminoPagoById);
router.get("/clave/:clave", getTerminoPagoByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTerminoPago
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligarotira").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarTerminoPago
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
