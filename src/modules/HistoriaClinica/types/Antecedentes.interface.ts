// Interfaz del subdocumento "antecedentes" de una HistoriaClinica.
// Todos los campos son opcionales: cada uno es un array de strings
// (el schema les pone default [] si no llegan).
import type IHabitos from './Habitos.interface';

interface IAntecedentes {
    alergias?: string[];
    enfermedadesCronicas?: string[];
    medicamentosHabituales?: string[];
    cirugiasPrevias?: string[];
    internacionesPrevias?: string[];
    antecedentesFamiliares?: string[];
    vacunas?: string[];
    habitos?: IHabitos;
    otros?: string;
}

export default IAntecedentes;