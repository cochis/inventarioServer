/*
Ruta : api/subsidiarias
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getSubsidiarias,
  crearSubsidiaria,
  actualizarSubsidiaria,
  isActive,
  getSubsidiariaById,
  getAllSubsidiarias,
  getSubsidiariaForSln,
  getSubsidiariaByClave
} = require("../controllers/subsidiaria");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getSubsidiarias);
router.get("/all", getAllSubsidiarias);
router.get("/all/salon", getSubsidiariaForSln);
router.get("/:uid", getSubsidiariaById);
router.get("/clave/:clave", getSubsidiariaByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearSubsidiaria
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
  actualizarSubsidiaria
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
