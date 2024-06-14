/*
Ruta : api/facturas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getFacturas,
  crearFactura,
  actualizarFactura,
  isActive,
  getFacturaById,
  getAllFacturas ,
  getMyFacturas
} = require("../controllers/factura");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getFacturas);
router.get("/all", validarJWT, getAllFacturas);
router.get("/my-facturas/:uid", validarJWT, getMyFacturas);
router.get("/:uid", validarJWT, getFacturaById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearFactura
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("tipoFactura", "El tipofactura es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarFactura
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
