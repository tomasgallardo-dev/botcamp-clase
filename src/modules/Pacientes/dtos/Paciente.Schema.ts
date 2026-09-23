/* ============================================================
    Paciente.Schema.ts
    Patrón "envuelto": los schemas describen el request completo
    ({ body, query }) y el middleware validarSchema los usa.
    Los tipos que exporta el controller los importa (req.body tipado).  
 ============================================================ */
import { z } from 'zod';
import { TipoTelefono } from '../types/PacienteTelefono.enum';

// Sub-schema reutilizable: la dirección (los campos de TU modelo).
export const direccionSchema = z.object({
    calle: z.string({ error: 'La calle es obligatoria' }),
    numero: z.string({ error: 'El número es obligatorio' }),
    ciudad: z.string({ error: 'La ciudad es obligatoria' }),
    provincia: z.string({ error: 'La provincia es obligatoria' }),
});

// telefono adaptado a tu modelo (codigoArea/numero) + tipo del profe (opcional).
export const telefonoSchema = z.object({
    tipo: z.enum(TipoTelefono).optional().default(TipoTelefono.CELULAR),
    codigoArea: z.string({ error: 'El código de área es obligatorio' })
        .regex(/^\d{1,4}$/, 'El código de área debe contener entre 1 y 4 dígitos'),
    numero: z.string({ error: 'El número es obligatorio' })
        .regex(/^\d{6,9}$/, 'El número debe contener entre 6 y 9 dígitos'),
});

// Body de POST /api/v1/pacientes.
export const crearPacienteSchema = z.object({
    body: z.object({
        nombre: z.string({ error: 'El nombre es obligatorio' }).min(2, 'El nombre es obligatorio'),
        apellido: z.string({ error: 'El apellido es obligatorio' }).min(2, 'El apellido es obligatorio'),
        dni: z.string({ error: 'El DNI es obligatorio' })
            .min(7, 'DNI invalido')
            .regex(/^\d{7,8}$/, 'El DNI debe contener entre 7 y 8 dígitos'),
        fechaNacimiento: z.iso.date({ error: 'formato de fecha invalido' }),
        sexo: z.enum(['Masculino', 'Femenino', 'Otro'], { error: 'El sexo debe ser Masculino, Femenino u Otro' }),
        direccion: direccionSchema,
        telefono: telefonoSchema,
        correoelectronico: z.email({ error: 'Email invalido' }),
        historialMedico: z.object({
            // Libre a propósito: el frontend permite "Escribir otra...".
            obraSocial: z.string({ error: 'La obra social es obligatoria' }).min(1, 'La obra social es obligatoria'),
            numAfiliado: z.string().optional(),
        }),
    })
});

// PUT: todos los campos de crear pasan a opcionales (como Partial<T>).
export const actualizarPacienteSchema = z.object({
    body: crearPacienteSchema.shape.body.partial(),
});

// GET /api/v1/pacientes?obraSocial=...&dni=...
export const queryPacientesSchema = z.object({
    query: z.object({
        obraSocial: z.string().optional(),
        dni: z.string().optional(),
    })
});

// PATCH /:id : agrega una consulta al historial (tu endpoint extra, el profe no lo tiene).
export const agregarConsultaSchema = z.object({
    body: z.object({
        fecha: z.iso.date({ error: 'formato de fecha invalido' }).optional(),
        diagnostico: z.string({ error: 'El diagnostico es obligatorio' }),
        tratamiento: z.string().optional(),
        medico: z.string({ error: 'El médico es obligatorio' }),
    })
});

// Tipos: el `['body']`/`['query']` va FUERA del z.infer (lección de turnos).
export type ICrearPacienteDTO = z.infer<typeof crearPacienteSchema>['body'];
export type IActualizarPacienteDTO = z.infer<typeof actualizarPacienteSchema>['body'];
export type IFiltroPacientesQuery = z.infer<typeof queryPacientesSchema>['query'];
export type IAgregarConsultaDTO = z.infer<typeof agregarConsultaSchema>['body'];