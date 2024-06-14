/*
Ruta : api/tipoTransportes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoTransportes,
  crearTipoTransporte,
  actualizarTipoTransporte,
  isActive,
  getTipoTransporteById,
  getAllTipoTransportes,
  getTipoTransporteForSln,
  getTipoTransporteByClave
} = require("../controllers/tipoTransporte");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoTransportes);
router.get("/all", getAllTipoTransportes);
router.get("/all/salon", getTipoTransporteForSln);
router.get("/:uid", getTipoTransporteById);
router.get("/clave/:clave", getTipoTransporteByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoTransporte
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
  actualizarTipoTransporte
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
