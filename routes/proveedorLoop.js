/*
Ruta : api/proveedorLoops
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getProveedorLoops,
  crearProveedorLoop,
  actualizarProveedorLoop,
  isActive,
  getProveedorLoopById,
  getAllProveedorLoops,
  getProveedorLoopForSln,
  getProveedorLoopByClave,
  cargaMasivaProveedorLoop
} = require("../controllers/proveedorLoop");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getProveedorLoops);
router.get("/all", getAllProveedorLoops);
router.get("/all/salon", getProveedorLoopForSln);
router.get("/:uid", getProveedorLoopById);
router.get("/clave/:clave", getProveedorLoopByClave);
router.post(
  "/",
  [
    validarJWT,
    
    validarCampos,
  ],
  crearProveedorLoop
);
router.post(
  "/masiva/",
  [
    validarJWT,
    
    validarCampos,
  ],
  cargaMasivaProveedorLoop
);

router.put(
  "/:id",
  [
    validarJWT,
 
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarProveedorLoop
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
