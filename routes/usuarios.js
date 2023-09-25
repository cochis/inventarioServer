/*
Ruta : api/usuarios
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  isActive,
  getUsuarioById,
  getAllUsuarios,
  actualizarPassUsuario,
  getUsuarioByCreatedUid
} = require("../controllers/usuarios");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getUsuarios);
router.get("/all", validarJWT, getAllUsuarios);
router.get("/:uid", validarJWT, getUsuarioById);
router.post(
  "/",
  [
    // validarAdminJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio ").isEmail().not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellidoPaterno", "El apellido paterno es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio ").isEmail().not().isEmpty(),
    check("role", "El role es obligatorio").not().isEmpty(),
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);
router.get(
  "/email/:user",
  [
    validarJWT,

  ],
  getUsuarioByCreatedUid
);
router.put(
  "/pass/:id",
  [
    validarJWT,
    check("email", "El email es obligatorio ").isEmail().not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPassUsuario
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
