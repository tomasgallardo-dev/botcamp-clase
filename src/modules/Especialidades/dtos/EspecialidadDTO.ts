// DTOs de Especialidad: contrato del body de POST y PUT.
// (mismo patrón que PacienteDTO.ts: ver ese archivo para la explicación)
export interface ICrearEspecialidadDTO {
    nombre: string;
    descripcion?: string;
}

// Actualizar = todos los campos opcionales.
export type IActualizarEspecialidadDTO = Partial<ICrearEspecialidadDTO>;