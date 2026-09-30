// ============================================================
//  CONTROLADOR: auth (login + registro de usuarios)
//  Endpoints bajo /api/v1/auth (montado en app.ts):
//   - POST /login      -> valida contra `usuarios` (bcrypt) y firma JWT.
//   - POST /registro   -> crea un usuario con password hasheada (bcrypt).
//  login responde con shape propio {ok, token} (el frontend Login.tsx
//  lo espera); registro con respuestaEstandar. Ambos NUNCA devuelven
//  la password (ni su hash).
// ============================================================

import type { Request, Response } from 'express';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('./Usuario.model');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');
const { esErrorDuplicado } = require('../../utils/manejoErrores.js');

const JWT_SECRET = process.env.JWT_SECRET || 'salita_municipal_secret_2026';

// POST /api/v1/auth/registro
const registrarUsuario = async (req: Request, res: Response) => {
    try {
        const { email, password, user, rol } = req.body;

        // Email O user ya registrados: findOne({email, user}) exigiría que
        // coincidan AMBOS; con $or alcanza con que exista uno de los dos.
        const existeUsuario = await Usuario.findOne({ $or: [{ email }, { user }] });
        if (existeUsuario) {
            return respuestaEstandar(res, 400, false, 'el email o el usuario ya esta registrado');
        }

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            email,
            user,
            password: passwordHash,
            rol
        });

        return respuestaEstandar(res, 201, true, 'Usuario creado correctamente', {
            id: nuevoUsuario.id,
            email: nuevoUsuario.email,
            user: nuevoUsuario.user
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            // unique de email/user: carrera entre dos registros a la vez.
            return respuestaEstandar(res, 409, false, 'el email o el usuario ya esta registrado', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// POST /api/v1/auth/login
const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Solo miramos por email (+ activo). No existe `user` en el body del login.
        const usuario = await Usuario.findOne({ email, activo: true });
        if (!usuario) {
            return respuestaEstandar(res, 401, false, 'credencial invalida');
        }

        // La password se guarda hasheada: SÍ o SÍ hay que comparar con bcrypt.
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return respuestaEstandar(res, 401, false, 'credencial invalida');
        }

        const payload = {
            id: usuario.id,
            email: usuario.email,
            user: usuario.user,
            rol: usuario.rol
        };

        // jwt.sign(payload, secreto, opciones): firma y expira en 9h.
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '9h' });

        // Shape {ok, token}: Login.tsx guarda data.token en localStorage.
        return res.status(200).json({ ok: true, token });
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { loginUsuario, registrarUsuario };