/*
Ruta : api/conceptoLoops
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getConceptoLoops,
  crearConceptoLoop,
  actualizarConceptoLoop,
  isActive,
  getConceptoLoopById,
  getAllConceptoLoops,
  getConceptoLoopForSln,
  getConceptoLoopByClave
} = require("../controllers/conceptoLoop");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getConceptoLoops);
router.get("/all", getAllConceptoLoops);
router.get("/all/salon", getConceptoLoopForSln);
router.get("/:uid", getConceptoLoopById);
router.get("/clave/:clave", getConceptoLoopByClave);
router.post(
  "/",
  [
    validarJWT,
    
    validarCampos,
  ],
  crearConceptoLoop
);

router.put(
  "/:id",
  [
    validarJWT,
 
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarConceptoLoop
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
