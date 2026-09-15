// Interfaz del subdocumento "habitos" dentro de antecedentes.
interface IHabitos {
    tabaquismo?: boolean;
    alcohol?: boolean;
    actividadFisica?: 'Ninguna' | 'Baja' | 'Moderada' | 'Alta';  // union type, igual que el enum del schema
}

export default IHabitos;