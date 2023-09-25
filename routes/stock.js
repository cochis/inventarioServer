/*
Ruta : api/stocks
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getStocks,
  crearStock,
  getAllStocks,
  actualizarStock,
  isActive,
  getStockById,
} = require("../controllers/stock");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getStocks);
router.get("/all", validarJWT, getAllStocks);
router.get("/:uid", validarJWT, getStockById);
 
 
 
router.post(
  "/",

  [
    validarJWT,
    check("tipoStock", "El tipo de stock es obligatorio").not().isEmpty(),
    check("modelo", "El modelo es obligatorio").not().isEmpty(),
    


    validarCampos,
  ],
  crearStock
);

router.put(
  "/:id",
  [
    validarJWT,
    check("tipoStock", "El tipo de stock es obligatorio").not().isEmpty(),
    check("modelo", "El modelo es obligatorio").not().isEmpty(),
 


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarStock
);
router.put(
  "/registro/:id",
  [

    check("fiesta", "La fiesta es obligatoria").not().isEmpty(),


    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarStock
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
