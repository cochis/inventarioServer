/*
Ruta : api/empresas
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getEmpresas,
  crearEmpresa,
  actualizarEmpresa,
  isActive,
  getEmpresaById,
  getAllEmpresas ,
  getMyEmpresas
} = require("../controllers/empresa");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getEmpresas);
router.get("/all", validarJWT, getAllEmpresas);
router.get("/my-empresas/:uid", validarJWT, getMyEmpresas);
router.get("/:uid", validarJWT, getEmpresaById);
 
router.post(
  "/",
  [
    validarJWT,
    


    validarCampos,
  ],
  crearEmpresa
);

router.put(
  "/:id",
  [
    validarJWT,
    
     

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarEmpresa
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
