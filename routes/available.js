/*
Ruta : api/availables
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getAvailables,
  crearAvailable,
  actualizarAvailable,
  isActive,
  getAvailableById,
  getAllAvailables ,
  getMyAvailables
} = require("../controllers/available");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getAvailables);
router.get("/all", validarJWT, getAllAvailables);
router.get("/my-availables/:uid", validarJWT, getMyAvailables);
router.get("/:uid", validarJWT, getAvailableById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearAvailable
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("tipoAvailable", "El tipoavailable es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarAvailable
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
