// ============================================================
//  RUTAS: Recepcion
//  Descripción: Endpoints de recepción. Todas cuelgan de
//  /api/v1/recepcion
// ============================================================

const express = require("express");
const router = express.Router();
const { registrarIngreso } = require('../controllers/recepcion.controller');

router.post("/ingreso", registrarIngreso);

module.exports = router;
