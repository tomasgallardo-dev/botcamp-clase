// ============================================================
//  ENTRYPOINT DEL BACKEND (app.ts)
//  Es el archivo que ejecuta "npm run dev" (ver package.json).
//  En orden, hace 8 cosas:
//   1) Cargar variables de entorno (.env)             -> dotenv
//   2) Crear la aplicación HTTP                        -> express
//   3) Conectarse a MongoDB                            -> connectDB
//   4) Registrar middlewares globales (corren en TODAS las peticiones)
//   5) Montar los routers de cada módulo bajo /api/v1/*
//   6) Middleware de 404 (ruta no encontrada)
//   7) Middleware de errores (respuestas 400/500 uniformes)
//   8) Poner a escuchar el servidor                    -> app.listen
// ============================================================

// 1) Lee el archivo .env y carga sus variables en process.env
//    (ej: process.env.PORT, process.env.DATABASE_URL).
require("dotenv").config();

// require() = forma CommonJS de importar (Node clásico). También se puede
// usar `import` (ESM) mezclado, porque tsx/tsc lo traducen a CommonJS.
// Express: framework para crear el servidor HTTP (rutas + middlewares).
// CORS: permite que el frontend (otro origen/puerto) haga peticiones.
const cors = require("cors");
const express = require("express");
// type Application = import('express').Application;
// Alias de TIPO: le da el nombre "Application" al tipo de express.
// OJO: la sintaxis `import('express')` acá es SOLO de tipos y TypeScript
// la borra al compilar (no hace ningún require en runtime).
type Application = import ('express').Application;
// Trae la función connectDB (la que abre la conexión a MongoDB).
const { connectDB } = require('./src/config/database');

// 2) Crea la instancia de la aplicación Express.
const app = express();
// 3) Dispara la conexión a MongoDB. La función es async y NO la esperamos:
//    mongoose conecta "en paralelo" mientras el server sigue arrancando.
connectDB();

// 4) Trae los middlewares propios del proyecto (#6 y #7 se usan al final).
const auditoriaMiddleware = require("./src/middlewares/auditoria.middleware");
const errorHandlerMiddleware = require("./src/middlewares/errorHandler.middleware");
const rutaNoEncontrada = require("./src/middlewares/rutaNoEncontrada.middleware");
// 5) Trae los routers de cada módulo. Cada uno es un "router" de Express
//    que define sus propios endpoints. NOTA: los paths van sin extensión,
//    tsx resuelve solo .ts / .js.
const authRoutes = require('./src/modules/Autenticacion/Autenticacion.routes');
const turnosRoutes = require("./src/modules/Turno/Turno.routes");
const pacientesRoutes = require("./src/modules/Paciente/Paciente.routes");
const recepcionRoutes = require("./src/modules/Recepcion/Recepcion.routes");
const especialidadesRoutes = require("./src/modules/Especialidad/Especialidad.routes");
const medicoRoutes = require("./src/modules/Medico/Medico.routes");
const historiaClinicaRoutes = require("./src/modules/HistoriaClinica/HistoriaClinica.routes");
const consultorioRoutes = require("./src/modules/Consultorio/Consultorio.routes");

// Middlewares globales: se ejecutan EN ORDEN para TODAS las peticiones.
app.use(cors());               // habilita CORS (frontend <-> backend)
app.use(express.json());       // convierte el JSON del body en req.body (objeto JS)
app.use(auditoriaMiddleware);  // nuestro log: fecha/hora + método + ruta

// Montaje de rutas: cada router "cuelga" de un prefijo.
// Ej: el cliente llama GET /api/v1/pacientes -> express entra al router
//    Paciente.routes.ts habiéndole "consumido" ya el prefijo /api/v1/pacientes.
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/turnos", turnosRoutes);
app.use("/api/v1/pacientes", pacientesRoutes);
app.use("/api/v1/recepcion", recepcionRoutes);
app.use("/api/v1/especialidades", especialidadesRoutes);
app.use("/api/v1/medicos", medicoRoutes);
app.use("/api/v1/historias-clinicas", historiaClinicaRoutes);
app.use("/api/v1/consultorios", consultorioRoutes);

// 6) Middleware 404: si NINGUNA ruta anterior coincidió, responde acá.
app.use(rutaNoEncontrada);

// 7) Manejo de errores: SIEMPRE al final. Atrapa los errores que un
//    controller pase con next(err) y responde con formato uniforme.
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
// 8) Pone el servidor a escuchar. El callback corre cuando ya está vivo.
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`============SERVIDOR MUNICIPAL ACTIVO==========`);
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.ENTORNO || 'Local'} `);
    console.log(`===============================================`);
});