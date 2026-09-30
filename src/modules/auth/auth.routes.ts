// ============================================================
//  RUTAS: auth (login + registro de usuarios)
//  Endpoints bajo /api/v1/auth (montado en app.ts):
//   - POST /login    -> valida credenciales y devuelve un JWT.
//   - POST /registro -> crea un usuario (zod + bcrypt).
//  Ambos pasan por validarSchema (zod) antes del controller.
// ============================================================

const express = require('express');
const router = express.Router();
const { loginUsuario, registrarUsuario } = require('./auth.controller');

const { validarSchema } = require('../../middlewares/validarDatos.middleware');
const { loginSchema } = require('./dtos/Login.schema');
const { registroSchema } = require('./dtos/Registro.schema');

router.post('/login', validarSchema(loginSchema), loginUsuario);
router.post('/registro', validarSchema(registroSchema), registrarUsuario);

module.exports = router;