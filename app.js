require("dotenv").config();
const express = require("express");
const app = express();

const auditoriaMiddleware = require("./src/middlewares/auditoria.middleware");
const errorHandlerMiddleware = require("./src/middlewares/errorHandler.middleware");

const turnosRoutes = require("./src/routes/turnos.routes");

app.use(express.json());
app.use(auditoriaMiddleware);

app.use("/api/v1/turnos", turnosRoutes);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`==========Servidor municipal anticipado =========`);
  console.log(`===============================================`);
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`===============================================`);
  console.log(`===============================================`);
});
