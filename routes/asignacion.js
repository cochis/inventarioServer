/*
Ruta : api/asignacion
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getAsignacions,
  crearAsignacion,
  actualizarAsignacion,
  isActive,
  getAsignacionById,
  getAllAsignacions
} = require("../controllers/asignacion");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getAsignacions);
router.get("/all", validarJWT, getAllAsignacions);
router.get("/:uid", validarAdminJWT, getAsignacionById);
router.post(
  "/",
  [
    validarJWT,

    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearAsignacion
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
  actualizarAsignacion
);


router.put(
  "/isActive/:id",
  [
    validarAdminJWT,
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  isActive
);


module.exports = router;
