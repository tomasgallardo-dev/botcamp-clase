// DTOs de Medico: contrato del body de POST y PUT.
// OJO: `especialidad` es el ObjectId (string) de un documento Especialidad.
export interface ICrearMedicoDTO {
    nombre: string;
    matricula: string;
    especialidad: string;
    telefono: string;
    email: string;
}

// Actualizar = todos los campos opcionales.
export type IActualizarMedicoDTO = Partial<ICrearMedicoDTO>;