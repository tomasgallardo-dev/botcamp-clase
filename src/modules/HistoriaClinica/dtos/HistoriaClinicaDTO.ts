// DTOs de HistoriaClinica: contrato del body (POST) y del query (GET).
import type IAntecedentes from '../types/Antecedentes.interface';

export interface ICrearHistoriaClinicaDTO {
    paciente: string;              // ObjectId del Paciente
    medico?: string;               // ObjectId del Medico (opcional)
    fecha: string | Date;
    antecedentes?: IAntecedentes;
    motivoConsulta: string;
    sintomas?: string[];
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
}

// Query de GET /historias-clinicas: ?pacienteId&?medicoId&?fecha&?sintomas
export interface IFiltroHistoriaClinicaQuery {
    pacienteId?: string;
    medicoId?: string;
    fecha?: string;
    sintomas?: string;   // llega como string, el controller lo parte por coma
}