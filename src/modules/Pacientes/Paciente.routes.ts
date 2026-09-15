// ============================================================
//  RUTAS: Pacientes
//  Un "router" de Express agrupa endpoints del mismo recurso.
//  Acá se define SOLO la parte que va después del prefijo montado en
//  app.ts (/api/v1/pacientes). Exp:
//    GET    /api/v1/pacientes      -> getPacientes
//    POST   /api/v1/pacientes      -> createPaciente
//    GET    /api/v1/pacientes/:id  -> getPacienteById  (:id sale de req.params.id)
//  CORS/DELETE/PUT/PATCH: ":" = parámetro de la URL.
//  Cada handler es una función del controller (no se invoca acá; Express
//  la llama cuando llega la petición).
// ============================================================

const express = require("express");
const router = express.Router();
const { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente, agregarConsulta } = require('./Paciente.controller');

//Rutas
router.get("/", getPacientes);               // listar (con filtros opcionales en ?query)
router.get("/:id", getPacienteById);          // detalle de uno (el :id va a req.params)
router.post("/", createPaciente);             // alta
router.put("/:id", updatePaciente);           // actualización completa/parcial
router.delete("/:id", deletePaciente);        // baja
router.patch("/:id", agregarConsulta);        // agregar una consulta al historial

module.exports = router;