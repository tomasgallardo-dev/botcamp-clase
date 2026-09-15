// ============================================================
//  CONSTANTE (no interfaz): lista compartida de especialidades para TURNOS.
//  `as const` congela el array: readonly + los strings se convierten en
//  LITERALES (no en `string` genérico). Así el tipo tiene exactamente
//  estos 22 valores y nada más.
//
//  La última línea DERIVA un tipo desde el array:
//    typeof EspecialidadTurno[number]
//    - typeof EspecialidadTurno   -> el tipo del array (los valores literales)
//    - [number]                   -> "uno cualquiera de sus elementos"
//  Resultado: EspecialidadTurno = 'cardiologia' | 'dermatologia' | ...
//  OJO: esta lista es para el modelo Turno (STRING). Medico/Consultorio
//  referencian la colección Especialidad (ObjectId) -> "dos mundos" (Pendiente).
// ============================================================

export const EspecialidadTurno = [
    'cardiologia',
    'dermatologia',
    'clinica medica',
    'pediatria',
    'neurologia',
    'traumatologia',
    'odontologia',
    'oftalmologia',
    'ginecologia',
    'psiquiatria',
    'geriatria',
    'endocrinologia',
    'gastroenterologia',
    'urologia',
    'otorrinolaringologia',
    'reumatologia',
    'neumonologia',
    'oncologia',
    'hematologia',
    'inmunologia',
    'infectologia',
    'bacteriologia',
] as const;

export type EspecialidadTurno = typeof EspecialidadTurno[number];