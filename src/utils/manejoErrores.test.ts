// ============================================================
//  TEST: manejoErrores
//  La utilidad esErrorDuplicado clasifica errores de Mongo/Mongoose
//  (violación de índice único) que los controllers mapean a 409.
// ============================================================
import { describe, it, expect } from 'vitest'
import * as manejoErrores from './manejoErrores'

const { esErrorDuplicado } = manejoErrores;

describe('esErrorDuplicado', () => {
    it('debe devolver true si el error trae code 11000 (índice único de Mongo)', () => {
        expect(esErrorDuplicado({ code: 11000 })).toBe(true);
    });

    it('debe devolver true para MongooseError con mensajes de "único"/"registr"/E11000', () => {
        const mongooseError = (message: string) => ({ name: 'MongooseError', message });

        expect(esErrorDuplicado(mongooseError('El campo ya tiene un valor único'))).toBe(true);
        expect(esErrorDuplicado(mongooseError('ya existe una registrad...'))).toBe(true);
        expect(esErrorDuplicado(mongooseError('E11000 duplicate key'))).toBe(true);
    });

    it('debe devolver false cuando no hay error', () => {
        expect(esErrorDuplicado(undefined)).toBe(false);
        expect(esErrorDuplicado(null)).toBe(false);
    });

    it('debe devolver false para errores que no son de duplicado', () => {
        expect(esErrorDuplicado({ code: 500 })).toBe(false);
        expect(esErrorDuplicado({ name: 'MongooseError', message: 'otra cosa' })).toBe(false);
        expect(esErrorDuplicado({})).toBe(false);
    });
});