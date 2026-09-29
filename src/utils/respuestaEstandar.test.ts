// ============================================================
//  TEST: respuestaEstandar
//  Formatea las respuestas de la API con shape único
//  { success, timestamp, message, total, data }.
// ============================================================
import { describe, it, expect, vi } from 'vitest'
import respuestaEstandar from './respuestaEstandar'

// Mock de `res` de Express: status() devuelve { json() }, json() captura el body.
const crearResMock = () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { res: { status } as any, status, json };
};

describe('respuestaEstandar', () => {
    it('debe responder con status y el body en { success, timestamp, message, total, data }', () => {
        const { res, status, json } = crearResMock();

        respuestaEstandar(res, 201, true, 'Creado', { id: '1' });

        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledTimes(1);

        const body = json.mock.calls[0][0];
        expect(body.success).toBe(true);
        expect(body.message).toBe('Creado');
        expect(body.timestamp).toBeTypeOf('string');
        expect(body.total).toBe(1);
        expect(body.data).toEqual({ id: '1' });
    });

    it('total = cantidad de elementos si data es un arreglo', () => {
        const { res, json } = crearResMock();

        respuestaEstandar(res, 200, true, 'ok', [1, 2, 3]);

        const body = json.mock.calls[0][0];
        expect(body.total).toBe(3);
        expect(body.data).toEqual([1, 2, 3]);
    });

    it('total = 0 y data = null si no llega data', () => {
        const { res, json } = crearResMock();

        respuestaEstandar(res, 404, false, 'No existe');

        const body = json.mock.calls[0][0];
        expect(body.total).toBe(0);
        expect(body.data).toBeNull();
    });
});