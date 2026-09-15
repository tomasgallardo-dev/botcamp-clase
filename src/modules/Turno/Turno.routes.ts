// ============================================================
//  RUTAS: Turnos
//  Endpoints de turnos. Cuelgan de /api/v1/turnos (montado en app.ts).
//  NOTA: versión MÁS COMPLETA (incluye filtro por especialidad,
//  PUT y PATCH que no estaban en feature/especialidades).
//  OJO con el ORDEN: /especialidad/:especialidad se registra ANTES de
//  /:id, si no, "especialidad/cardiologia" casaría con :id.
// ============================================================

const express = require("express");
const router = express.Router();
const { getTurnos, getTurnoById, createTurno, deleteTurno, getTurnosPorEspecialidad,
  updateTurno,
  updateEspecialidad, marcarAtendido } = require('./Turno.controller');

router.get("/", getTurnos);                          // listar (?id= para uno viejo por query)
router.post("/", createTurno);                       // alta (acepta ?urgencia=true o body.urgente)
router.delete("/:id", deleteTurno);                  // baja (soft: activo:false + CANCELADO)
router.get("/especialidad/:especialidad", getTurnosPorEspecialidad); // filtro por especialidad
router.get("/:id", getTurnoById);                    // detalle
router.put("/:id", updateTurno);                     // update general
router.patch("/:id/especialidad", updateEspecialidad); // cambiar solo especialidad
router.patch("/:id/atendido", marcarAtendido);       // cambiar solo estado a atendido

module.exports = router;