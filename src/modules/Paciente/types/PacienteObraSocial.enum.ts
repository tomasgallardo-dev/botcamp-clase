// ============================================================
//  ENUM de obras sociales (misma lista que el frontend: OBRAS_SOCIALES).
//  Un enum con STRING values: queda un objeto { OSDE:'OSDE', ... } en runtime.
//  Se usa como lista de valores válidos en los schemas de zod (z.enum(ObraSocial)).
//  OJO: los values deben coincidir exacto con lo que manda el frontend
//  (mayúsculas, sin acentos). La clave con espacio se escribe con guión bajo:
//  SWISS_MEDICAL = 'SWISS MEDICAL'.
// ============================================================

export enum ObraSocial {
    OSDE = 'OSDE',
    PAMI = 'PAMI',
    SWISS_MEDICAL = 'SWISS MEDICAL',
    GALENO = 'GALENO',
    MEDIFE = 'MEDIFE',
    IOSFA = 'IOSFA',
    OTRO = 'OTRO',
    NINGUNA = 'NINGUNA',
}