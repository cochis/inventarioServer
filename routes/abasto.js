/*
Ruta : api/abastos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getAbastos,
  crearAbasto,
  actualizarAbasto,
  isActive,
  getAbastoById,
  getAllAbastos,
  getAbastoForSln,
  getAbastoByClave
} = require("../controllers/abasto");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getAbastos);
router.get("/all", getAllAbastos);
router.get("/all/salon", getAbastoForSln);
router.get("/:uid", getAbastoById);
router.get("/clave/:clave", getAbastoByClave);
router.post(
  "/",
  [
    validarJWT,
 

    validarCampos,
  ],
  crearAbasto
);

router.put(
  "/:id",
  [
    validarJWT,
 

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarAbasto
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
