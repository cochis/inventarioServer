/*
Ruta : api/tipoFacturas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoFacturas,
  crearTipoFactura,
  actualizarTipoFactura,
  isActive,
  getTipoFacturaById,
  getAllTipoFacturas,
  getTipoFacturaForSln,
  getTipoFacturaByClave
} = require("../controllers/tipoFactura");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoFacturas);
router.get("/all", getAllTipoFacturas);
router.get("/all/salon", getTipoFacturaForSln);
router.get("/:uid", getTipoFacturaById);
router.get("/clave/:clave", getTipoFacturaByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoFactura
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
  actualizarTipoFactura
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
