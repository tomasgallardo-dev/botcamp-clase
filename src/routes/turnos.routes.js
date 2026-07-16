// src/routes/turnos.routes.js
const express = require("express");
const router = express.Router();
const { getTurnos, createTurno, deleteTurno } = require('../controllers/turnos.controller');

// Acá van TODAS las rutas de la salita
router.get("/", getTurnos);
router.post("/", createTurno);
router.delete("/:id", deleteTurno);
router.get("/especialidad/:especialidad",
  turnosController.getTurnosPorEspecialidad);
router.put("/:id", turnosController.updateTurno);
router.patch("/:id/especialidad", turnosController.updateEspecialidad);
module.exports = router;
