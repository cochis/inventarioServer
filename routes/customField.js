/*
Ruta : api/customFields
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getCustomFields,
  crearCustomField,
  actualizarCustomField,
  isActive,
  getCustomFieldById,
  getAllCustomFields,
  getCustomFieldForSln,
  getCustomFieldByClave
} = require("../controllers/customField");
const { validarJWT, validarAdminJWT } = require("../middlewares/validar-jwt");
const router = Router();


router.get("/", getCustomFields);
router.get("/all", getAllCustomFields);
router.get("/all/salon", getCustomFieldForSln);
router.get("/:uid", getCustomFieldById);
router.get("/clave/:clave", getCustomFieldByClave);
router.post(
  "/",
  [
    validarJWT,
 

    validarCampos,
  ],
  crearCustomField
);

router.put(
  "/:id",
  [
    validarJWT,
 

    check("lastEdited", "La fecha de edición es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarCustomField
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
