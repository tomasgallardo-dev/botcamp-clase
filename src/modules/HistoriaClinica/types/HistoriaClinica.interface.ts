// Interfaz de documento HistoriaClinica (solo tipos; valida el schema).
import type { Types } from 'mongoose';
import type IAntecedentes from './Antecedentes.interface';

interface IHistoriaClinica {
    _id: Types.ObjectId;
    paciente: Types.ObjectId;
    medico?: Types.ObjectId;
    fecha: Date;
    antecedentes?: IAntecedentes;
    motivoConsulta: string;
    sintomas?: string[];
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
    activo?: boolean;          // soft delete
    createdAt?: Date;
    updatedAt?: Date;
}

export default IHistoriaClinica;