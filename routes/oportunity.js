/*
Ruta : api/oportunities
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getOportunities,
  crearOportunity,
  actualizarOportunity,
  isActive,
  getOportunityById,
  getAllOportunities,
  getOportunityForSln,
  getOportunityByClave
} = require("../controllers/oportunity");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getOportunities);
router.get("/all", getAllOportunities);
router.get("/all/salon", getOportunityForSln);
router.get("/:uid", getOportunityById);
router.get("/clave/:clave", getOportunityByClave);
router.post(
  "/",
  [
    validarJWT,
 

    validarCampos,
  ],
  crearOportunity
);

router.put(
  "/:id",
  [
    validarJWT,
    
    validarCampos,
  ],
  actualizarOportunity
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
