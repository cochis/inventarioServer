/*
Ruta : api/pipelines
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPipelines,
  crearPipeline,
  actualizarPipeline,
  isActive,
  getPipelineById,
  getAllPipelines,
  getPipelineForSln,
  getPipelineByClave
} = require("../controllers/pipeline");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getPipelines);
router.get("/all", getAllPipelines);
router.get("/all/salon", getPipelineForSln);
router.get("/:uid", getPipelineById);
router.get("/clave/:clave", getPipelineByClave);
router.post(
  "/",
  [
    validarJWT,
    
    validarCampos,
  ],
  crearPipeline
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligarotira").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPipeline
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
