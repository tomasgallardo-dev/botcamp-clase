// DTO del body de POST /api/v1/recepcion/ingreso (alta de paciente + turno
// en un solo POST). REUTILIZA el DTO de creación de Paciente para el
// sub-objeto datosPaciente (un DTO se compone con otro DTO -> DRY).
import type { ICrearPacienteDTO } from '../../Pacientes/dtos/PacienteDTO';

export interface IRegistrarIngresoDTO {
    datosPaciente: ICrearPacienteDTO;
    especialidad: string;
    fechaTurno: string | Date;
    estado?: string;          // opcional: default 'pendiente'
    observaciones?: string;
    medico?: string | null;   // opcional: default null
}