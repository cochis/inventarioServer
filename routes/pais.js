/*
Ruta : api/paiss
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPaiss,
  crearPais,
  actualizarPais,
  isActive,
  getPaisById,
  getAllPaiss ,
  getMyPaiss
} = require("../controllers/pais");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getPaiss);
router.get("/all", validarJWT, getAllPaiss);
router.get("/my-paiss/:uid", validarJWT, getMyPaiss);
router.get("/:uid", validarJWT, getPaisById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearPais
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("tipoPais", "El tipopais es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPais
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
