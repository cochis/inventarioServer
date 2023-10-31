/*
Ruta : api/productoJasus
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getProductoJasus,
  crearProductoJasu,
  actualizarProductoJasu,
  isActive,
  getProductoJasuById,
  getAllProductoJasus ,
  getMyProductoJasus,
  dropProductosJasu
} = require("../controllers/productoJasu");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getProductoJasus);
router.get("/all", validarJWT, getAllProductoJasus);
router.get("/my-productoJasus/:uid", validarJWT, getMyProductoJasus);
router.get("/:uid", validarJWT, getProductoJasuById);
router.put("/table/drop", validarJWT, dropProductosJasu);
 
router.post(
  "/",
  [
    validarJWT,
    


    validarCampos,
  ],
  crearProductoJasu
);

router.put(
  "/:id",
  [
    validarJWT,
    
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarProductoJasu
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
