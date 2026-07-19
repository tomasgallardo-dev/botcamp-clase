const mongoose = require('mongoose');
// aca uso una constante para la conexion a la base de datos, que se encuentra en el archivo .env usando try catch para manejar errores y eventos de conexion y desconexion
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
    } catch (error) {
        console.error('🔴 Error al conectar a la base de datos:', error);
        process.exit(1); //aca en.exit(1) se indica que la aplicacion se cierra con un error
    }
};
// aca se definen los eventos de conexion y desconexion de la base de datos, para poder manejar los errores y mostrar mensajes en la consola
mongoose.connection.on('connected', () => {
    console.log('🟢 Conexión a la base de datos establecida');
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Conexión a la base de datos perdida');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔵 Conexión a la base de datos cerrada por terminación de la aplicación');
    process.exit(0); //aca en.exit(0) se indica que la aplicacion se cierra sin errores
});

module.exports = connectDB;