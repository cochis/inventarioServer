/*
Ruta : api/proveedors
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getProveedors,
  crearProveedor,
  actualizarProveedor,
  isActive,
  getProveedorById,
  getAllProveedors ,
  getMyProveedors
} = require("../controllers/proveedor");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getProveedors);
router.get("/all", validarJWT, getAllProveedors);
router.get("/my-proveedors/:uid", validarJWT, getMyProveedors);
router.get("/:uid", validarJWT, getProveedorById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearProveedor
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("proveedorProveedor", "El proveedorproveedor es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarProveedor
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
