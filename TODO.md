# TODO - Integración de ramas (Proyecto Salita Municipal)

> Este archivo registra el progreso de la integración de las 4 ramas de trabajo
> en el proyecto principal (main), **sin tocar git** (sin add/commit/push).

## Pasos del plan

- [x] 1. Analizar el estado del proyecto y el contenido de todas las ramas
- [x] 2. Crear `src/models/HistoriaClinica.js`
- [x] 3. Crear `src/controllers/historiaClinica.controller.js`
- [x] 4. Crear `src/routes/historiaClinica.routes.js`
- [x] 5. Crear `src/models/Consultorio.js`
- [x] 6. Crear `src/controllers/consultorio.controller.js`
- [x] 7. Crear `src/routes/consultorio.routes.js`
- [x] 8. Unificar `app.js` con las 7 rutas registradas
- [x] 9. Agregar comentarios explicativos a los archivos existentes
- [x] 10. Verificar que el servidor arranca (prueba final)

## Notas importantes

- `medico.js` usa `especialidad` como `ObjectId` ref `'Especialidad'` (se mantiene).
- `Pacientes.js` mantiene `historialMedico.consultas` (se mantiene).
- `turnos.controller.js` mantiene todos los endpoints (es la versión más completa).
- **NO ejecutar git add/commit/push**: eso lo hace el usuario.

