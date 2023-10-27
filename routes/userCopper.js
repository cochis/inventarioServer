/*
Ruta : api/userCoppers
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUserCoppers,
  crearUserCopper,
  actualizarUserCopper,
  isActive,
  getUserCopperById,
  getAllUserCoppers,
  getUserCopperForSln,
  getUserCopperByClave
} = require("../controllers/userCopper");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getUserCoppers);
router.get("/all", getAllUserCoppers);
router.get("/all/salon", getUserCopperForSln);
router.get("/:uid", getUserCopperById);
router.get("/clave/:clave", getUserCopperByClave);
router.post(
  "/",
  [
    validarJWT,
    

    validarCampos,
  ],
  crearUserCopper
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
  actualizarUserCopper
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
