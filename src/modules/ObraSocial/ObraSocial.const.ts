// ============================================================
//  CONSTANTE compartida: lista de obras sociales.
//  La USAN varios módulos (Paciente schema+DCTO, etc.) por eso vive en su
//  propia carpeta y no dentro de un módulo en particular.
//  `as const` hace el array readonly y convierte sus strings en literales.
//  ObraSocial = el tipo derivado: 'OSDE' | 'PAMI' | 'SWISS MEDICAL' | ...
//  (== typeof OBRAS_SOCIALES[number]: "uno cualquiera de sus elementos")
// ============================================================

export const OBRAS_SOCIALES = [
    'OSDE',
    'PAMI',
    'SWISS MEDICAL',
    'GALENO',
    'MEDIFE',
    'IOSFA',
    'OTRO',
    'NINGUNA',
] as const;

export type ObraSocial = (typeof OBRAS_SOCIALES)[number];