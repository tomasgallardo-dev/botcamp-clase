// Interfaz de documento Especialidad (solo tipos; valida el schema).
import type { Types } from 'mongoose';

interface IEspecialidad {
    _id: Types.ObjectId;
    nombre: string;
    descripcion?: string;
}

export default IEspecialidad;