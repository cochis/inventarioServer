/*
Ruta : api/productos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getProductos,
  crearProducto,
  actualizarProducto,
  isActive,
  getProductoById,
  getAllProductos ,
  getMyProductos
} = require("../controllers/producto");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getProductos);
router.get("/all", validarJWT, getAllProductos);
router.get("/my-productos/:uid", validarJWT, getMyProductos);
router.get("/:uid", validarJWT, getProductoById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
  
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarProducto
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
