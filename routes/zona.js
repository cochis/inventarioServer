/*
Ruta : api/zonas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getZonas,
  crearZona,
  actualizarZona,
  isActive,
  getZonaById,
  getAllZonas ,
  getMyZonas
} = require("../controllers/zona");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getZonas);
router.get("/all", validarJWT, getAllZonas);
router.get("/my-zonas/:uid", validarJWT, getMyZonas);
router.get("/:uid", validarJWT, getZonaById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearZona
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
     

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarZona
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
