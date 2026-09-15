// ============================================================
//  DTOs de Turnos
//  Contrato del body/query de las peticiones de turnos.
//  Fue el ajuste 5: firma del controller tipada con estos DTOs.
// ============================================================

// Body de POST /api/v1/turnos
export interface ICrearTurnoDTO {
    paciente: string;         // ObjectId del paciente (viene como string en JSON)
    especialidad: string;     // nombre de especialidad (lo valida el enum del schema)
    fechaTurno: String | Date;
    // medico es OPCIONAL y admite null (turno sin médico: guardia, etc).
    // (OJO: preparado para exactOptionalPropertyTypes, por eso la unión | null
    //  admite explícitamente null, no solo "que falte")
    medico?: string | null;
    // urgente en el body (alternativa al query ?urgencia=true)
    urgente?: boolean;
}

// Query de POST /api/v1/turnos?urgencia=true
export interface IQueryUrgencia {
    urgencia?: string;
}