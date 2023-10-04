/*
Ruta : api/pagosTerminos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPagosTerminos,
  crearPagosTermino,
  actualizarPagosTermino,
  isActive,
  getPagosTerminoById,
  getAllPagosTerminos ,
  getMyPagosTerminos
} = require("../controllers/pagosTermino");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getPagosTerminos);
router.get("/all", validarJWT, getAllPagosTerminos);
router.get("/my-pagosTerminos/:uid", validarJWT, getMyPagosTerminos);
router.get("/:uid", validarJWT, getPagosTerminoById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearPagosTermino
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("tipoPagosTermino", "El tipopagosTermino es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPagosTermino
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
