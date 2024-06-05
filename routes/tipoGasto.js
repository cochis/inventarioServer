/*
Ruta : api/tipoGastos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoGastos,
  crearTipoGasto,
  actualizarTipoGasto,
  isActive,
  getTipoGastoById,
  getAllTipoGastos,
  getTipoGastoForSln,
  getTipoGastoByClave
} = require("../controllers/tipoGasto");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoGastos);
router.get("/all", getAllTipoGastos);
router.get("/all/salon", getTipoGastoForSln);
router.get("/:uid", getTipoGastoById);
router.get("/clave/:clave", getTipoGastoByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoGasto
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
  actualizarTipoGasto
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
