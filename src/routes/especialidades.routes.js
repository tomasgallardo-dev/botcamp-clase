// ============================================================
//  RUTAS: Especialidades
//  Descripción: Endpoints de especialidades. Todas cuelgan de
//  /api/v1/especialidades
//  Agregado por la rama: feature/especialidades
// ============================================================

const express = require("express");
const router = express.Router();
const { getEspecialidades, createEspecialidad} = require('../controllers/especialidades.controller');

router.get("/", getEspecialidades);
router.post("/", createEspecialidad);

module.exports = router;
