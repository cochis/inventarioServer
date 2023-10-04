/*
Ruta : api/tipoCargas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoCargas,
  crearTipoCarga,
  actualizarTipoCarga,
  isActive,
  getTipoCargaById,
  getAllTipoCargas,
  getTipoCargaForSln,
  getTipoCargaByClave
} = require("../controllers/tipoCarga");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getTipoCargas);
router.get("/all", getAllTipoCargas);
router.get("/all/salon", getTipoCargaForSln);
router.get("/:uid", getTipoCargaById);
router.get("/clave/:clave", getTipoCargaByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearTipoCarga
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
  actualizarTipoCarga
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
