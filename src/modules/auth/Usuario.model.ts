// ============================================================
//  MODELO: Usuario
//  Usuarios del sistema que pueden loguearse (email + password + rol).
//  `rol` se guarda como STRING ('ADMIN' | 'RECEPCIONISTA') para que el
//  frontend lea el valor tal cual (no 0/1 como enum numérico).
//  OJO: la password llega hasheada con bcrypt (nunca texto plano).
// ============================================================

import { Schema, model } from 'mongoose';

// Enum con valores STRING: si pones valores string, mongoose guarda el texto
// 'ADMIN'/'RECEPCIONISTA' y no el número de índice (0/1) de un enum numérico.
enum Rol {
    ADMIN = 'ADMIN',
    RECEPCIONISTA = 'RECEPCIONISTA',
}

// Forma del documento (sin extends Document): estructura de datos reutilizable.
interface IUsuario {
    email: string;
    user: string;
    password: string;
    rol: Rol;
    activo: boolean;
}

const usuarioSchema = new Schema<IUsuario>({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: [true, 'Este email ya está registrado'], // duplicado -> error 11000 -> 409
        lowercase: true,    // normaliza a minúsculas al guardar (login sin distinguir mayús/minús)
        trim: true,
        match: [/\S+@\S+\.\S+/, 'El email debe tener un formato válido'],
    },
    user: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: [true, 'Este nombre de usuario ya está registrado'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
        type: String,
        enum: Object.values(Rol),   // whitelist: solo ADMIN o RECEPCIONISTA
        default: Rol.RECEPCIONISTA, // por defecto el rol con menos permisos
    },
    activo: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Misma normalización _id -> id que en los demás modelos.
usuarioSchema.set('toJSON', {
    transform: (documento: any, usuarioRetorno: any) => {
        usuarioRetorno.id = usuarioRetorno._id;
        delete usuarioRetorno._id;
        delete usuarioRetorno.__v;
        return usuarioRetorno;
    }
});

module.exports = model<IUsuario>('Usuario', usuarioSchema, 'usuarios');
module.exports.Rol = Rol; // para poder usar el enum desde los controllers/seed