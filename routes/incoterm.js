/*
Ruta : api/incoterms
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getIncoterms,
  crearIncoterm,
  actualizarIncoterm,
  isActive,
  getIncotermById,
  getAllIncoterms ,
  getMyIncoterms
} = require("../controllers/incoterm");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getIncoterms);
router.get("/all", validarJWT, getAllIncoterms);
router.get("/my-incoterms/:uid", validarJWT, getMyIncoterms);
router.get("/:uid", validarJWT, getIncotermById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearIncoterm
);

router.put(
  "/:id",
  [
    validarJWT,
 
   

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarIncoterm
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
