// ============================================================
//  ENUM de tipos de teléfono.
//  Se usa como lista de valores válidos en zod: z.enum(TipoTelefono).
//  El frontend hoy NO manda "tipo"; por eso en el schema va opcional con
//  default CELULAR (y mongoose ignora el campo porque no está en el modelo).
// ============================================================

export enum TipoTelefono {
    CELULAR = 'celular',
    FIJO = 'fijo',
}