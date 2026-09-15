// Interfaz de documento Consultorio (solo tipos; valida el schema).
import type { Types } from 'mongoose';
import type ITelefono from '../../Pacientes/types/Telefono.interface';

interface IConsultorio {
    _id: Types.ObjectId;
    medico: Types.ObjectId;        // referencia
    especialidad: Types.ObjectId;  // referencia
    numeroConsultorio: string;
    piso: string;
    direccion: string;
    telefono: ITelefono;
    email: string;
}

export default IConsultorio;