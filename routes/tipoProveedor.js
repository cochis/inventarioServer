/*
Ruta : api/tipostocks
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getTipoProveedors,
  crearTipoProveedor,
  actualizarTipoProveedor,
  isActive,
  getTipoProveedorById,
  getAllTipoProveedors 
} = require("../controllers/tipoProveedor");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getTipoProveedors);
router.get("/all", validarJWT, getAllTipoProveedors);
router.get("/:uid", validarJWT, getTipoProveedorById);
 
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),
    


    validarCampos,
  ],
  crearTipoProveedor
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarTipoProveedor
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
