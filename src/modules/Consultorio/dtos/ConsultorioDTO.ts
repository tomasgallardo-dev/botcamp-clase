// DTOs de Consultorio: contrato del body de POST y PUT.
// Reutiliza ITelefono (de Pacientes/types) para no repetir ese shape.
import type ITelefono from '../../Pacientes/types/Telefono.interface';

export interface ICrearConsultorioDTO {
    medico: string;              // ObjectId de un documento Medico
    especialidad: string;        // ObjectId de un documento Especialidad
    numeroConsultorio: string;
    piso: string;
    direccion: string;
    telefono: ITelefono;
    email: string;
}

// Actualizar = todos los campos opcionales.
export type IActualizarConsultorioDTO = Partial<ICrearConsultorioDTO>;