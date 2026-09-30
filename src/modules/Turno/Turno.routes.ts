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
  updateEspecialidad, marcarAtendido, limpiarAtendidos } = require('./Turno.controller');

const { CrearTurnoSchema } = require('./dtos/Turno.schema');
const { validarSchema } = require('../../middlewares/validarDatos.middleware');
const { validarJWT } = require('../../middlewares/validarJWT.middleware');

// NOTA de validación: el middleware corre ANTES que el controller.
// Si el body no cumple CrearTurnoSchema -> 400 y ni entra al controller.
// TODOS los endpoints de turnos exigen token válido (validarJWT).
router.get("/", validarJWT, getTurnos);                          // listar (?id= para uno viejo por query)
router.post("/", validarJWT, validarSchema(CrearTurnoSchema), createTurno);

router.delete("/atendidos", validarJWT, limpiarAtendidos);

router.delete("/:id", validarJWT, deleteTurno); 

router.get("/especialidad/:especialidad", validarJWT, getTurnosPorEspecialidad); // filtro por especialidad
router.get("/:id", validarJWT, getTurnoById);                    // detalle
router.put("/:id", validarJWT, updateTurno);                     // update general
router.patch("/:id/especialidad", validarJWT, updateEspecialidad); // cambiar solo especialidad
router.patch("/:id/atendido", validarJWT, marcarAtendido);       // cambiar solo estado a atendido

module.exports = router;