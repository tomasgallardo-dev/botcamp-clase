require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require('./src/config/database');

const app = express();
connectDB();

// Middlewares propios
const auditoriaMiddleware = require("./src/middlewares/auditoria.middleware");
const errorHandlerMiddleware = require("./src/middlewares/errorHandler.middleware");
const rutaNoEncontrada = require("./src/middlewares/rutaNoEncontrada.middleware");  // ✅ Importado

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const turnosRoutes = require("./src/routes/turnos.routes");
const pacientesRoutes = require("./src/routes/pacientes.routes");
const recepcionRoutes = require("./src/routes/recepcion.routes");
const especialidadesRoutes = require("./src/routes/especialidades.routes");
const medicoRoutes = require("./src/routes/medico.routes");
const historiaClinicaRoutes = require("./src/routes/historiaClinica.routes");
const consultorioRoutes = require("./src/routes/consultorio.routes");

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(auditoriaMiddleware);

// Registro de rutas
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/turnos", turnosRoutes);
app.use("/api/v1/pacientes", pacientesRoutes);
app.use("/api/v1/recepcion", recepcionRoutes);
app.use("/api/v1/especialidades", especialidadesRoutes);
app.use("/api/v1/medicos", medicoRoutes);
app.use("/api/v1/historias-clinicas", historiaClinicaRoutes);
app.use("/api/v1/consultorios", consultorioRoutes);

// ✅ Middleware 404 (siempre antes del error handler)
app.use(rutaNoEncontrada);

// Manejo de errores (siempre al final)
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`============SERVIDOR MUNICIPAL ACTIVO==========`);
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.ENTORNO || 'Local'} `);
    console.log(`===============================================`);
});