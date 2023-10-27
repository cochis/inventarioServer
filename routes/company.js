/*
Ruta : api/companys
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCompanys,
  crearCompany,
  actualizarCompany,
  isActive,
  getCompanyById,
  getAllCompanys,
  getCompanyForSln,
  getCompanyByClave
} = require("../controllers/company");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getCompanys);
router.get("/all", getAllCompanys);
router.get("/all/salon", getCompanyForSln);
router.get("/:uid", getCompanyById);
router.get("/clave/:clave", getCompanyByClave);
router.post(
  "/",
  [
    validarJWT,
 

    validarCampos,
  ],
  crearCompany
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
  actualizarCompany
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
