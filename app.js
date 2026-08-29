// ============================================================
//  ARCHIVO PRINCIPAL DEL SERVIDOR (app.js)
//  Descripción: Es el punto de entrada de la aplicación.
//  Acá se crea el servidor Express, se conecta a MongoDB y se
//  registran TODAS las rutas del sistema de la Salita Municipal.
//
//  Este archivo fue unificado a partir de 4 ramas de desarrollo:
//    - feature/especialidades   -> agrega /especialidades
//    - feature/medico           -> agrega /medicos
//    - feature/historiaClinica  -> agrega /historias-clinicas
//    - featured/Consultorio     -> agrega /consultorios
//  Más las que ya estaban en master: /turnos, /pacientes, /recepcion
// ============================================================

// ------------------------------------------------------------
// 1) CARGAR VARIABLES DE ENTORNO (.env)
//    dotenv lee el archivo .env y lo pone en process.env
//    (por ejemplo el PORT, la URI de MongoDB, etc.)
// ------------------------------------------------------------
require("dotenv").config();

// ------------------------------------------------------------
// 2) IMPORTAR EXPRESS Y LA CONEXIÓN A LA BASE DE DATOS
//    express: framework para crear el servidor y manejar rutas.
//    connectDB: función que conecta con MongoDB.
// ------------------------------------------------------------
const cors = require("cors");
const express = require("express");
const connectDB = require('./src/config/database');

// Creamos la instancia de la aplicación Express y habilitamos CORS para permitir peticiones desde otros dominios.
const app = express();
app.use(cors());


// ------------------------------------------------------------
// 3) CONECTAR A MONGODB
//    Se ejecuta apenas arranca el servidor.
// ------------------------------------------------------------
connectDB();

// ------------------------------------------------------------
// 4) IMPORTAR MIDDLEWARES (funciones que se ejecutan en todas
//    las peticiones antes de llegar a las rutas)
//    - auditoria: registra/loguea cada petición.
//    - errorHandler: captura errores y responde con formato estándar.
// ------------------------------------------------------------
const auditoriaMiddleware = require("./src/middlewares/auditoria.middleware");
const errorHandlerMiddleware = require("./src/middlewares/errorHandler.middleware");

// ------------------------------------------------------------
// 5) IMPORTAR TODAS LAS RUTAS (unificación de las 4 ramas)
//    Cada archivo de rutas define los endpoints de su módulo.
// ------------------------------------------------------------
// Rutas que ya existían en master:
const turnosRoutes = require("./src/routes/turnos.routes");              // CRUD de turnos
const pacientesRoutes = require("./src/routes/pacientes.routes");        // CRUD de pacientes
const recepcionRoutes = require("./src/routes/recepcion.routes");        // Ingreso de pacientes + turno (transacción)

// Rutas agregadas por feature/especialidades:
const especialidadesRoutes = require("./src/routes/especialidades.routes"); // CRUD de especialidades

// Rutas agregadas por feature/medico:
const medicoRoutes = require("./src/routes/medico.routes");              // CRUD de médicos

// Rutas agregadas por feature/historiaClinica:
const historiaClinicaRoutes = require("./src/routes/historiaClinica.routes"); // Historias clínicas

// Rutas agregadas por featured/Consultorio:
const consultorioRoutes = require("./src/routes/consultorio.routes");    // CRUD de consultorios

// ------------------------------------------------------------
// 6) MIDDLEWARES GLOBALES
//    app.use() registra middlewares que se ejecutan en TODAS
//    las peticiones HTTP que lleguen al servidor.
// ------------------------------------------------------------
// CORS: permite que el servidor acepte peticiones desde otros dominios (por ejemplo, desde el frontend).
app.use(cors());
// express.json(): permite recibir JSON en el body de las peticiones.
app.use(express.json());

// auditoriaMiddleware: loguea cada petición recibida.
app.use(auditoriaMiddleware);

// ------------------------------------------------------------
// 7) REGISTRO DE RUTAS (cada módulo cuelga de su prefijo /api/v1/...)
// ------------------------------------------------------------
// Módulo de turnos: /api/v1/turnos
app.use("/api/v1/turnos", turnosRoutes);

// Módulo de pacientes: /api/v1/pacientes
app.use("/api/v1/pacientes", pacientesRoutes);

// Módulo de recepción (ingreso): /api/v1/recepcion
app.use("/api/v1/recepcion", recepcionRoutes);

// Módulo de especialidades: /api/v1/especialidades
app.use("/api/v1/especialidades", especialidadesRoutes);

// Módulo de médicos: /api/v1/medicos
app.use("/api/v1/medicos", medicoRoutes);

// Módulo de historias clínicas: /api/v1/historias-clinicas
app.use("/api/v1/historias-clinicas", historiaClinicaRoutes);

// Módulo de consultorios: /api/v1/consultorios
app.use("/api/v1/consultorios", consultorioRoutes);

// ------------------------------------------------------------
// 8) MIDDLEWARE DE MANEJO DE ERRORES
//    Debe ir DESPUÉS de todas las rutas para capturar cualquier
//    error que ocurra y responder con un formato estándar.
// ------------------------------------------------------------
app.use(errorHandlerMiddleware);

// ------------------------------------------------------------
// 9) INICIAR EL SERVIDOR
//    Escucha en el puerto configurado (process.env.PORT) o 3000.
// ------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`============SERVIDOR MUNICIPAL ACTIVO==========`);
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.ENTORNO || 'Local'} `);
    console.log(`===============================================`);
});

