// DTO del body de login: { email, password }
// (las credenciales se validan hardcodeadas en Autenticacion.controller.ts)
export interface ILoginDTO {
    email: string;
    password: string;
}