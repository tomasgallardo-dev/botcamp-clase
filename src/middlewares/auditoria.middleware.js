const auditoriaMunicipal = (req, res, next) => {
  const horaActual = new Date().toLocaleString();
  const metodo = req.method;
  const ruta = req.originalUrl;

  console.log(`Hora: ${horaActual} - Método: ${metodo} - Ruta: ${ruta}`);

  next();
};

module.exports = auditoriaMunicipal;
