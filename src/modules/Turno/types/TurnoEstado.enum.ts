// ============================================================
//  ENUM de estados de turno.
//  A diferencia de las interfaces (que se borran al compilar), un `enum`
//  ES un valor real en runtime: queda un objeto
//  { PENDIENTE:'pendiente', ATENDIDO:'atendido', CANCELADO:'cancelado' }.
//  Por eso en Turno.ts se importa SIN "type" (se usa como value) y en el
//  controller también (TurnoEstado.ATENDIDO para urgencia, etc).
//  OJO con "string enums": el valor guardado es el string ('pendiente',
//  no 'PENDIENTE').
// ============================================================

export enum TurnoEstado {
    PENDIENTE = "pendiente",
    ATENDIDO = "atendido",
    CANCELADO = "cancelado"
}