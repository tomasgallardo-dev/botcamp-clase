// ============================================================
//  RUTAS: Pacientes
//  Descripción: Endpoints de pacientes. Todas cuelgan de /api/v1/pacientes
// ============================================================

const express = require("express");
const router = express.Router();
const { getPacientes, createPaciente, deletePaciente, agregarConsulta } = require('../controllers/pacientes.controller');

//Rutas
router.get("/", getPacientes);
router.post("/", createPaciente);
router.delete("/:id", deletePaciente);
router.patch("/:id", agregarConsulta);

module.exports = router;
