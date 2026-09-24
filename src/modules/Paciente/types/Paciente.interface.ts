// ============================================================
//  Interfaz de Paciente
//  Describe la FORMA de un documento de la colección "pacientes"
//  (los tipos de los campos guardados). Es la "cara de tipos" del schema.
//  CUIDADO: TypeScript no la VALIDA en runtime; la validación real la
//  hace el schema (Pacientes.ts). Esto es solo para que el compilador
//  y el editor conozcan la forma del documento.
// ============================================================

import type { Types } from 'mongoose';   // import SOLO de tipos (se borra al compilar)
import type IDireccion from './Direccion.interface';
import type ITelefono from './Telefono.interface';
import type IHistorialMedico from './HistorialMedico.interface';

interface IPaciente {
    _id: Types.ObjectId;   // el _id que genera Mongo
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: Date;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    direccion: IDireccion;
    telefono: ITelefono;
    correoelectronico: string;
    historialMedico: IHistorialMedico;
}
// export default = exportación por defecto (se importa: import IPaciente from '...')
export default IPaciente;