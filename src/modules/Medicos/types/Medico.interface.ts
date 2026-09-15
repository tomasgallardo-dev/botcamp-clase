// Interfaz de documento Medico (solo tipos; valida el schema).
import type { Types } from 'mongoose';

interface IMedico {
    _id: Types.ObjectId;
    nombre: string;
    matricula: string;
    especialidad: Types.ObjectId;   // referencia a la colección Especialidad
    telefono: string;
    email: string;
    activo?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IMedico;