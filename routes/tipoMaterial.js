/*
Ruta : api/tipoMaterials
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoMaterials,
  crearTipoMaterial,
  actualizarTipoMaterial,
  isActive,
  getTipoMaterialById,
  getAllTipoMaterials,
  getTipoMaterialForSln,
  getTipoMaterialByClave
} = require("../controllers/tipoMaterial");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoMaterials);
router.get("/all", getAllTipoMaterials);
router.get("/all/salon", getTipoMaterialForSln);
router.get("/:uid", getTipoMaterialById);
router.get("/clave/:clave", getTipoMaterialByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoMaterial
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
  actualizarTipoMaterial
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
