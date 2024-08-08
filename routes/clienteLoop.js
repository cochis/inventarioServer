/*
Ruta : api/clienteLoops
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getClienteLoops,
  crearClienteLoop,
  actualizarClienteLoop,
  isActive,
  getClienteLoopById,
  getAllClienteLoops,
  getClienteLoopForSln,
  getClienteLoopByClave
} = require("../controllers/clienteLoop");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getClienteLoops);
router.get("/all", getAllClienteLoops);
router.get("/all/salon", getClienteLoopForSln);
router.get("/:uid", getClienteLoopById);
router.get("/clave/:clave", getClienteLoopByClave);
router.post(
  "/",
  [
    validarJWT,
    
    validarCampos,
  ],
  crearClienteLoop
);

router.put(
  "/:id",
  [
    validarJWT,
 
    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarClienteLoop
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
