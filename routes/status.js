/*
Ruta : api/statuss
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getStatuss,
  crearStatus,
  actualizarStatus,
  isActive,
  getStatusById,
  getAllStatuss ,
  getMyStatuss
} = require("../controllers/status");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getStatuss);
router.get("/all", validarJWT, getAllStatuss);
router.get("/my-statuss/:uid", validarJWT, getMyStatuss);
router.get("/:uid", validarJWT, getStatusById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearStatus
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("tipoStatus", "El tipostatus es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarStatus
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
