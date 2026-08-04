// ============================================================
//  RUTAS: Medico
//  Descripción: Endpoints de médicos. Todas cuelgan de
//  /api/v1/medicos
//  Agregado por la rama: feature/medico
// ============================================================

const express = require("express");
const router = express.Router();
const { getMedicos, createMedico, deleteMedico } = require('../controllers/medico.controller');

router.get("/", getMedicos);
router.post("/", createMedico);
router.delete("/:id", deleteMedico);

module.exports = router;
