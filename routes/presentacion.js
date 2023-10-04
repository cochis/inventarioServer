/*
Ruta : api/presentacions
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getPresentacions,
  crearPresentacion,
  actualizarPresentacion,
  isActive,
  getPresentacionById,
  getAllPresentacions ,
  getMyPresentacions
} = require("../controllers/presentacion");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getPresentacions);
router.get("/all", validarJWT, getAllPresentacions);
router.get("/my-presentacions/:uid", validarJWT, getMyPresentacions);
router.get("/:uid", validarJWT, getPresentacionById);
 
router.post(
  "/",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),


    validarCampos,
  ],
  crearPresentacion
);

router.put(
  "/:id",
  [
    validarJWT,
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("tipoPresentacion", "El tipopresentacion es obligatorio").not().isEmpty(),

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarPresentacion
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
