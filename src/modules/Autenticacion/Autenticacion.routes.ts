// ============================================================
//  RUTAS: Autenticacion
//  Endpoints de auth (login). Cuelgan de /api/v1/auth (montado en app.ts).
//  Solo un POST /login. El controller valida credenciales hardcodeadas
//  (prototipo) y devuelve {ok, token}.
// ============================================================

const express = require('express');
const router = express.Router();
const { login } = require('./Autenticacion.controller');

const { validarSchema } = require('../../middlewares/validarDatos.middleware');
const { loginSchema } = require('./dtos/Autenticacion.schema');

router.post('/login', validarSchema(loginSchema), login);

module.exports = router;