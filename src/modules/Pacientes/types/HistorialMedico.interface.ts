// Interfaz de subdocumento: historial médico del paciente.
// obraSocial es `string` libre: el frontend también permite escribir
// obras sociales nuevas (el const OBRAS_SOCIALES es solo la lista sugerida).
import type IConsulta from './Consulta.interface';

interface IHistorialMedico {
    obraSocial: string;
    numAfiliado?: string;   // opcional: no hace falta si obraSocial es NINGUNA
    consultas: IConsulta[];
}
export default IHistorialMedico;