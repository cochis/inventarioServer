/*
Ruta : api/specDataEss
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getSpecDataEss,
  crearSpecDataEs,
  actualizarSpecDataEs,
  isActive,
  getSpecDataEsById,
  getAllSpecDataEss ,
  getMySpecDataEss
} = require("../controllers/specDataEs");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getSpecDataEss);
router.get("/all", validarJWT, getAllSpecDataEss);
router.get("/my-specDataEss/:uid", validarJWT, getMySpecDataEss);
router.get("/:uid", validarJWT, getSpecDataEsById);
 
router.post(
  "/",
  [
    validarJWT,
    


    validarCampos,
  ],
  crearSpecDataEs
);

router.put(
  "/:id",
  [
    validarJWT,
 
 
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarSpecDataEs
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
 