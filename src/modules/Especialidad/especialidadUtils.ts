// ============================================================
//  UTILIDAD: especialidadUtils
//  Normalización del nombre + especialidades por defecto (seed).
//  El nombre en la colección es ÚNICO y va en MAYÚSCULAS sin
//  acentos (NEUROLOGIA, no NEUROLOGÍA): normalizar evita duplicados
//  disfrazados ("neurologia" vs "NEUROLOGÍA").
// ============================================================

const normalizarNombreEspecialidad = (valor: string): string =>
    String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita acentos (á -> a, ñ -> n)
        .replace(/\s+/g, ' ')            // espacios múltiples -> uno solo
        .trim()
        .toUpperCase();

const ESPECIALIDADES_DEFAULT: { nombre: string; descripcion: string }[] = [
    {
        nombre: 'CARDIOLOGIA',
        descripcion: 'Diagnóstico y tratamiento de las enfermedades del corazón y el sistema circulatorio.',
    },
    {
        nombre: 'TRAUMATOLOGIA',
        descripcion: 'Atención de lesiones y enfermedades del sistema osteoarticular (huesos, articulaciones y músculos).',
    },
    {
        nombre: 'GINECOLOGIA',
        descripcion: 'Cuidado de la salud del sistema reproductor femenino.',
    },
    {
        nombre: 'PEDIATRIA',
        descripcion: 'Salud y seguimiento de niños y adolescentes.',
    },
    {
        nombre: 'NEUROLOGIA',
        descripcion: 'Estudio y tratamiento de las enfermedades del sistema nervioso.',
    },
];

module.exports = { normalizarNombreEspecialidad, ESPECIALIDADES_DEFAULT };