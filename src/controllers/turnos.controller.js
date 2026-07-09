//
// src/controllers/turnos.controller.js

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

// Función para estandarizar la respuesta de la API
const respuestaEstandar = (res, status, success, message, data = null) => {
  return res.status(status).json({
    success,
    timestamp: new Date().toISOString(),
    message,
    total: Array.isArray(data) ? data.length : data ? 1 : 0,
    data,
  });
};

// Función para obtener todos los turnos
const getTurnos = (req, res) => {
  respuestaEstandar(res, 200, true, "Turnos obtenidos exitosamente", turnos);
};

// Función para crear un nuevo turno
const createTurno = (req, res) => {
  const { paciente, dni, especialidad } = req.body;

  if (!paciente || !dni || !especialidad) {
    return respuestaEstandar(
      res,
      400,
      false,
      "Todos los campos son obligatorios",
    );
  }

  const nuevoTurno = {
    id: turnos.length + 1,
    paciente,
    dni,
    especialidad,
  };
  turnos.push(nuevoTurno);
  respuestaEstandar(res, 201, true, "Turno creado exitosamente", nuevoTurno);
};

// Función para eliminar un turno por ID
const deleteTurno = (req, res) => {
  const { id } = req.params;
  const index = turnos.findIndex((turno) => turno.id === parseInt(id));

  if (index === -1) {
    return respuestaEstandar(res, 404, false, "Turno no encontrado");
  }

  turnos = turnos.filter((turno) => turno.id !== parseInt(id));
  respuestaEstandar(res, 200, true, "Turno eliminado exitosamente", turnos);
};

//funcion pra obtener turnos por especialidad
const getTurnosPorEspecialidad = (req, res) => {
  const { especialidad } = req.params;
  const turnosFiltrados = turnos.filter(
    (turno) =>
      turno.especialidad.toLocaleLowerCase() ===
      especialidad.toLocaleLowerCase(),
  );
  if (turnosFiltrados.length === 0) {
    return respuestaEstandar(
      res,
      404,
      false,
      "No se encontraron turnos para la especialidad especificada",
    );
  }
  respuestaEstandar(
    res,
    200,
    true,
    "Turnos obtenidos exitosamente",
    turnosFiltrados,
  );
};

module.exports = {
  getTurnos,
  createTurno,
  deleteTurno,
  getTurnosPorEspecialidad,
};
