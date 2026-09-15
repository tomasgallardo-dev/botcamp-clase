// Interfaz de subdocumento: teléfono (fijo o celular).
// La reutilizan Paciente y Consultorio (no repetir el shape en cada lado).
interface ITelefono {
    codigoArea: string;
    numero: string;
}
export default ITelefono;