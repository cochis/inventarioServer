/*
Ruta : api/puestos
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPuestos,
  crearPuesto,
  actualizarPuesto,
  isActive,
  getPuestoById,
  getAllPuestos ,
  getMyPuestos
} = require("../controllers/puesto");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getPuestos);
router.get("/all", validarJWT, getAllPuestos);
router.get("/my-puestos/:uid", validarJWT, getMyPuestos);
router.get("/:uid", validarJWT, getPuestoById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearPuesto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
     

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPuesto
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
