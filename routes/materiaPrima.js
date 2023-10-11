/*
Ruta : api/materiaPrimas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getMateriaPrimas,
  crearMateriaPrima,
  actualizarMateriaPrima,
  isActive,
  getMateriaPrimaById,
  getAllMateriaPrimas,
  getMateriaPrimaForSln,
  getMateriaPrimaByClave
} = require("../controllers/materiaPrima");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getMateriaPrimas);
router.get("/all", getAllMateriaPrimas);
router.get("/all/salon", getMateriaPrimaForSln);
router.get("/:uid", getMateriaPrimaById);
router.get("/clave/:clave", getMateriaPrimaByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearMateriaPrima
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
  actualizarMateriaPrima
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
