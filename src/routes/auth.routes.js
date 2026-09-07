// esto se encarga de manejar las rutas relacionadas con la autenticación de usuarios, como el inicio de sesión.
// conecta con el archivo auth.controller.js para ejecutar la lógica de autenticación cuando se recibe una solicitud POST a /login.
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');

router.post('/login', login);

module.exports = router;