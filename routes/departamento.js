/*
Ruta : api/departamentos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getDepartamentos,
  crearDepartamento,
  actualizarDepartamento,
  isActive,
  getDepartamentoById,
  getAllDepartamentos ,
  getMyDepartamentos
} = require("../controllers/departamento");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getDepartamentos);
router.get("/all", validarJWT, getAllDepartamentos);
router.get("/my-departamentos/:uid", validarJWT, getMyDepartamentos);
router.get("/:uid", validarJWT, getDepartamentoById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearDepartamento
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
     

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarDepartamento
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
