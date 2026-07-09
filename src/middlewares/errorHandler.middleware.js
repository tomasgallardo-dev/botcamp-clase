// aca se maneja el error de ruta no encontrada (404)
const rutaNoEncontrada = (req, res, next) => {
  res.status(404).json({
    success: false,
    timestamp: new Date().toISOString(),
    error: "Ruta no encontrada (404)",
    message: `La ruta ${req.originalUrl} no existe en el servidor.`,
  });
};

module.exports = rutaNoEncontrada;
