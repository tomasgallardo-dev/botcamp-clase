// ============================================================
//  TEST: Especialidad.schema
//  Valida el body (zod) de POST/PUT /api/v1/especialidades.
// ============================================================
import { describe, it, expect } from 'vitest'
import { crearEspecialidadSchema, actualizarEspecialidadSchema } from './Especialidad.schema'

describe('crearEspecialidadSchema', () => {
    it('acepta un body válido', () => {
        const resultado = crearEspecialidadSchema.safeParse({ body: { nombre: 'CARDIOLOGIA' } });
        expect(resultado.success).toBe(true);
    });

    it('acepta descripcion como opcional', () => {
        const conDescripcion = crearEspecialidadSchema.safeParse({ body: { nombre: 'PEDIATRIA', descripcion: 'Niños' } });
        const sinDescripcion = crearEspecialidadSchema.safeParse({ body: { nombre: 'PEDIATRIA' } });

        expect(conDescripcion.success).toBe(true);
        expect(sinDescripcion.success).toBe(true);
    });

    it('rechaza si falta nombre', () => {
        const resultado = crearEspecialidadSchema.safeParse({ body: {} });
        expect(resultado.success).toBe(false);
    });

    it('rechaza si nombre es demasiado corto', () => {
        const resultado = crearEspecialidadSchema.safeParse({ body: { nombre: 'X' } });
        expect(resultado.success).toBe(false);
    });
});

describe('actualizarEspecialidadSchema', () => {
    it('permite mandar solo descripcion (partial del body de creación)', () => {
        const resultado = actualizarEspecialidadSchema.safeParse({ body: { descripcion: 'Nueva descripción' } });
        expect(resultado.success).toBe(true);
    });
});