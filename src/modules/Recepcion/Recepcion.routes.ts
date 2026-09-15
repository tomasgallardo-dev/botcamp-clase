// ============================================================
//  RUTAS: Recepcion
//  Endpoints de recepción. Cuelgan de /api/v1/recepcion (montado en app.ts).
//  Un solo endpoint: recibe paciente + turno y los crea en transacción.
// ============================================================

const express = require("express");
const router = express.Router();
const { registrarIngreso } = require('./Recepcion.controller');

router.post("/ingreso", registrarIngreso);

module.exports = router;