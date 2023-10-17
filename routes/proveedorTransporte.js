/*
Ruta : api/proveedorTransportes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getProveedorTransportes,
  crearProveedorTransporte,
  actualizarProveedorTransporte,
  isActive,
  getProveedorTransporteById,
  getAllProveedorTransportes,
  getProveedorTransporteForSln,
  getProveedorTransporteByClave
} = require("../controllers/proveedorTransporte");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getProveedorTransportes);
router.get("/all", getAllProveedorTransportes);
router.get("/all/salon", getProveedorTransporteForSln);
router.get("/:uid", getProveedorTransporteById);
router.get("/clave/:clave", getProveedorTransporteByClave);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("clave", "La clave es obligatoria").not().isEmpty(),

    validarCampos,
  ],
  crearProveedorTransporte
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
  actualizarProveedorTransporte
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
