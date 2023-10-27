/*
Ruta : api/contacTypes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getContacTypes,
  crearContacType,
  actualizarContacType,
  isActive,
  getContacTypeById,
  getAllContacTypes,
  getContacTypeForSln,
  getContacTypeByClave
} = require("../controllers/contacType");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getContacTypes);
router.get("/all", getAllContacTypes);
router.get("/all/salon", getContacTypeForSln);
router.get("/:uid", getContacTypeById);
router.get("/clave/:clave", getContacTypeByClave);
router.post(
  "/",
  [
    validarJWT,
    

    validarCampos,
  ],
  crearContacType
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
  actualizarContacType
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
