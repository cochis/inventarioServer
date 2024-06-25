/*
Ruta : api/pagoProgramados
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPagoProgramados,
  crearPagoProgramado,
  actualizarPagoProgramado,
  isActive,
  getPagoProgramadoById,
  getAllPagoProgramados,
  getPagoProgramadoForSln,
  getPagoProgramadoByClave,
  getPagoProgramadosByUser
} = require("../controllers/pagoProgramado");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getPagoProgramados);
router.get("/all", getAllPagoProgramados);
router.get("/user/:user", getPagoProgramadosByUser);
router.get("/all/salon", getPagoProgramadoForSln);
router.get("/:uid", getPagoProgramadoById);
router.get("/clave/:clave", getPagoProgramadoByClave);
router.post(
  "/",
  [
    validarJWT,
 
    check("subsidiaria", "La subsidiaria es obligatoria").not().isEmpty(),
    check("tipoGasto", "El tipo de gasto es obligatorio").not().isEmpty(),
    check("terminoPago", "El termino de pago es obligatorio").not().isEmpty(),
    check("proveedor", "El proveedor de pago es obligatorio").not().isEmpty(),
    check("concepto", "El concepto es obligatorio").not().isEmpty(),

    validarCampos,
  ],
  crearPagoProgramado
);

router.put(
  "/:id",
  [
    validarJWT,
    check("subsidiaria", "La subsidiaria es obligatoria").not().isEmpty(),
    check("tipoGasto", "El tipo de gasto es obligatorio").not().isEmpty(),
    check("terminoPago", "El termino de pago es obligatorio").not().isEmpty(),
    check("proveedor", "El proveedor de pago es obligatorio").not().isEmpty(),
    check("concepto", "El concepto es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarPagoProgramado
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
