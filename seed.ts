// ============================================================
//  SEED + MIGRACIÓN: especialidades (npm run seed)
//  1) MIGRA docs viejos: normaliza nombre (sin acentos, MAYÚSCULAS)
//     y saca la descripción de prueba "Prueba zod". -> recomendación A
//  2) SIEMBRA las 5 especialidades por defecto con su descripción. -> D
//  IDEMPOTENTE: correrlo dos veces no duplica (busca por nombre).
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Especialidad = require('./src/modules/Especialidad/Especialidad.model');
const Usuario = require('./src/modules/auth/Usuario.model');
const {
    normalizarNombreEspecialidad,
    ESPECIALIDADES_DEFAULT,
} = require('./src/modules/Especialidad/especialidadUtils');

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/salita_municipal';

const main = async () => {
    await mongoose.connect(DATABASE_URL);
    console.log('Mongo conectado');

    // 1) MIGRACIÓN: normaliza documentos ya existentes.
    const documentos = await Especialidad.find();
    let migrados = 0;
    for (const documento of documentos) {
        const nombreNormalizado = normalizarNombreEspecialidad(documento.nombre);
        const descripcionActual = documento.descripcion || '';
        const descripcionMigrada = descripcionActual === 'Prueba zod' ? '' : descripcionActual;

        if (nombreNormalizado !== documento.nombre || descripcionMigrada !== descripcionActual) {
            documento.nombre = nombreNormalizado;
            documento.descripcion = descripcionMigrada;
            await documento.save();
            migrados += 1;
        }
    }
    console.log(migrados ? `Migrados ${migrados} documento(s)` : 'Sin documentos para migrar');

    // 2) SEED: crea o completa las 5 por defecto.
    for (const especialidadDefault of ESPECIALIDADES_DEFAULT) {
        const existente = await Especialidad.findOne({ nombre: especialidadDefault.nombre });
        if (!existente) {
            await Especialidad.create(especialidadDefault);
            console.log(`+ Creada: ${especialidadDefault.nombre}`);
        } else if (!(existente.descripcion || '')) {
            existente.descripcion = especialidadDefault.descripcion;
            await existente.save();
            console.log(`~ Descripción cargada: ${especialidadDefault.nombre}`);
        } else {
            console.log(`= Ya existía: ${especialidadDefault.nombre}`);
        }
    }

    // 3) SEED USUARIO ADMIN: mantiene el login de prueba del frontend.
    //    Ahora el login valida contra la BD, así que el admin debe existir
    //    con su password hasheada (bcrypt).
    const ADMIN_EMAIL = 'admin@salita.com';
    let usuarioAdmin = await Usuario.findOne({ email: ADMIN_EMAIL });
    if (!usuarioAdmin) {
        const passwordHash = await bcrypt.hash('12345', 10);
        await Usuario.create({
            email: ADMIN_EMAIL,
            user: 'admin',
            password: passwordHash,
            rol: 'ADMIN',
        });
        console.log('+ Usuario admin creado (admin@salita.com / 12345)');
    } else {
        console.log('= Usuario admin ya existía');
    }

    await mongoose.disconnect();
    console.log('Seed finalizado');
};

main().catch(async (error: any) => {
    console.error('SEED FALLÓ:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});