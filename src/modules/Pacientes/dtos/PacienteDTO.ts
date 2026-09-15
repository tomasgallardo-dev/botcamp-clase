// ============================================================
//  DTOs de Pacientes
//  DTO (Data Transfer Object) = la FORMA que esperamos que tenga lo que
//  entra por el body/query de las peticiones. Es un CONTRATO:
//  el controller tipa `req.body` con estos tipos y TypeScript nos avisa
//  si el código intenta usar un campo que no existe.
//  IMPORTANTE: son SOLO tipos (se borran al compilar, costo cero en runtime).
// ============================================================

// Reutilizamos las interfaces "de documento" para no repetir la forma
// de direccion/telefono acá dentro.
import type IDireccion from '../types/Direccion.interface';
import type ITelefono from '../types/Telefono.interface';

// Body de POST /api/v1/pacientes
export interface ICrearPacienteDTO {
    nombre: string;
    apellido: string;
    dni: string;
    // El frontend manda la fecha como string; mongoose la convierte a Date,
    // por eso aceptamos las dos.
    fechaNacimiento: string | Date;
    // Union type: solo estos 3 valores (igual que el enum del schema).
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    direccion: IDireccion;
    telefono: ITelefono;
    correoelectronico: string;   // el frontend NO manda "email", usa este nombre
    historialMedico: {
        obraSocial: string;   // libre (la lista OBRAS_SOCIALES es solo sugerida)
        numAfiliado?: string;    // ? = campo OPCIONAL
    };
}

// Actualizar = TODOS los campos opcionales (puede llegar solo uno).
// Partial<T> transforma cada campo en opcional automáticamente.
export type IActualizarPacienteDTO = Partial<ICrearPacienteDTO>;

// Query de GET /api/v1/pacientes  (?obraSocial=..&dni=..)
// Se usa en el 4to tipo genérico de Request: Request<{},{},{},IFiltroPacientesQuery>
export interface IFiltroPacientesQuery {
    obraSocial?: string;
    dni?: string;
}

// Body de PATCH /api/v1/pacientes/:id (agrega una consulta al historial)
export interface IAgregarConsultaDTO {
    fecha?: string | Date;
    diagnostico: string;
    tratamiento?: string;
    medico: string;
}