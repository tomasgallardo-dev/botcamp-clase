// ============================================================
//  RUTAS: Turnos
//  Descripción: Endpoints de turnos. Todas cuelgan de /api/v1/turnos
//  NOTA: versión MÁS COMPLETA (incluye filtro por especialidad,
//  PUT y PATCH que no estaban en feature/especialidades).
// ============================================================

// src/routes/turnos.routes.js
const express = require("express");
const router = express.Router();
const { getTurnos, getTurnoById, createTurno, deleteTurno, getTurnosPorEspecialidad,
  updateTurno,
  updateEspecialidad, marcarAtendido } = require('../controllers/turnos.controller');

// Acá van TODAS las rutas de la salita
router.get("/", getTurnos);
router.post("/", createTurno);
router.delete("/:id", deleteTurno);
router.get("/especialidad/:especialidad", getTurnosPorEspecialidad);
router.get("/:id", getTurnoById);
router.put("/:id", updateTurno);
router.patch("/:id/especialidad", updateEspecialidad);
router.patch("/:id/atendido", marcarAtendido);

module.exports = router;
