const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let turnos = [
  {
    id: 1,
    paciente: "juan perez",
    dni: "3388557744",
    especialidad: "cardiologia",
  },
  {
    id: 2,
    paciente: "pedro perez",
    dni: "34234234234",
    especialidad: "cardiologia",
  },
  {
    id: 3,
    paciente: "maria Garcia",
    dni: "3231231345",
    especialidad: "cardiologia",
  },
  {
    id: 4,
    paciente: "luis Rodriguez",
    dni: "33812312744",
    especialidad: "cardiologia",
  },
];

app.get("/api/v1/turnos", (req, res) => {
  res.status(200).json({
    total: turnos.length,
    data: turnos,
  });
});

app.post("/api/v1/turnos", (req, res) => {
  const { paciente, dni, especialidad } = req.body;

  if (!paciente || !dni || !especialidad) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  const nuevoTurno = {
    id: turnos.length + 1,
    paciente,
    dni,
    especialidad,
  };

  turnos.push(nuevoTurno);
  res
    .status(201)
    .json({ message: "Turno creado exitosamente", data: nuevoTurno });
});

app.delete("/api/v1/turnos/:id", (req, res) => {
  const { id } = req.params;
  const turnoExiste = turnos.some((t) => t.id === parseInt(id));

  if (!turnoExiste) {
    return res.status(404).json({ error: "Turno no encontrado" });
  }

  turnos = turnos.filter((t) => t.id !== parseInt(id));
  res
    .status(200)
    .json({ message: "Turno eliminado exitosamente", data: turnos });
});

app.get("/api/v1/turnos/especialidad/:especialidad", (req, res) => {
  const { especialidad } = req.params;

  const turnosFiltrados = turnos.filter(
    (t) => t.especialidad.toLowerCase() === especialidad.toLowerCase(),
  );

  if (turnosFiltrados.length === 0) {
    return res.status(404).json({
      error: `No se encontraron turnos para la especialidad "${especialidad}"`,
    });
  }

  res.status(200).json({
    total: turnosFiltrados.length,
    data: turnosFiltrados,
  });
});

app.get("/api/v1/turnos/dni/:dni", (req, res) => {
  const { dni } = req.params;

  const turnosFiltrados = turnos.find((t) => t.dni === dni);

  if (!turnosFiltrados) {
    return res.status(404).json({
      error: `No se encontraron turnos para el DNI "${dni}"`,
    });
  }

  res.status(200).json({
    data: turnosFiltrados,
  });
});

app.get("/api/v1/turnos/buscar", (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ error: "Falta el parámetro 'nombre'" });
  }

  const turnosFiltrados = turnos.filter((t) =>
    t.paciente.toLowerCase().includes(nombre.toLowerCase()),
  );

  if (turnosFiltrados.length === 0) {
    return res.status(404).json({
      error: `No se encontraron turnos para el nombre "${nombre}"`,
    });
  }

  res.status(200).json({
    total: turnosFiltrados.length,
    data: turnosFiltrados,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
