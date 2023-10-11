/*
Ruta : api/unidadMedidas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUnidadMedidas,
  crearUnidadMedida,
  actualizarUnidadMedida,
  isActive,
  getUnidadMedidaById,
  getAllUnidadMedidas,
  getUnidadMedidaForSln,
  getUnidadMedidaByClave
} = require("../controllers/unidadMedida");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getUnidadMedidas);
router.get("/all", getAllUnidadMedidas);
router.get("/all/salon", getUnidadMedidaForSln);
router.get("/:uid", getUnidadMedidaById);
router.get("/clave/:clave", getUnidadMedidaByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearUnidadMedida
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
  actualizarUnidadMedida
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
