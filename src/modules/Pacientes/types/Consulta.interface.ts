// Interfaz de CADA consulta dentro de historialMedico.consultas.
interface IConsulta {
    fecha?: Date;        // opcional: el schema le pone Date.now por defecto
    diagnostico: string;
    tratamiento?: string;
    medico: string;
}
export default IConsulta;