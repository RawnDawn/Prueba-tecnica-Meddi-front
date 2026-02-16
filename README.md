### Prueba técnica para Meddi

## Objetivo

Desarrollar una interfaz de usuario para una aplicación web que permita gestionar tareas (CRUD) con las siguientes funcionalidades:

- Crear tareas
- Editar tareas
- Eliminar tareas
- Marcar tareas como completadas
- Filtrar tareas por prioridad
- Agrupar tareas por prioridad (Una lista por prioridad)
- Filtrar tareas por fecha de creación
- Ordenar tareas por fecha de creación
- Buscar tareas por titulo
- Mostrar la cantidad de tareas por prioridad (Gráfica de tipo dona, barra, etc.)
- Mostrar la cantidad de tareas por estado (Gráfica de tipo dona, barra, etc.)
- Mostrar ranking de los tres días de la semana con mas tareas CREADAS
- Mostrar ranking de los tres días de la semana con mas tareas COMPLETADAS


Las tareas creadas deben tener como mínimo los siguientes campos:
- id (_id de MongoDB)
- Titulo
- Descripción
- Prioridad (Baja, Media, Alta)
- Fecha de creación
- Fecha de vencimiento
- Estado (Pendiente, Completada)

Debes trabajar partiendo de la ruta /tasksManager

## Requisitos

- Puedes utilizar solo las dependencias que se encuentran instaladas en este proyecto
- Utilizar TypeScript
- Utilizar Tailwind CSS
- Utilizar Pinia
- Manejo de fechas (dayjs o nativo)
- Utilizar Lucide Icons
- Utilizar Shadcn UI
- Utilizar Vue 3 composition API
- Utilizar Nuxt 4 (No hay mucho que configurar, solo se requiere entender el proyecto)

## Puntos a evaluar

- Clean code
- Uso básico de typescript
- Manipulación de datos con javascript
- Manejo de asincronía
- Uso de vue 3 composition API
- Uso de tailwind css
- Uso de pinia
- Desarrollo de componentes limpios y reutilizables
- Uso adecuado de reactividad
- Manejo del ciclo de vida de los componentes
- Manejo de errores
- Manejo de formularios
- Manejo de validaciones
- Uso de composables para reutilizar código


## Puntos extra (deseables, no obligatorios)

- Uso de lucide icons
- Uso de shadcn ui
- Dominio de nuxt 4 (Aprovechar las funcionalidades que vienen configuradas en el proyecto)
- Uso avanzado de typescript

## Consideraciones

- NO puedes utilizar IA para generar el código, el objetivo es evaluar tu capacidad de resolución de problemas y tu conocimiento de las tecnologías mencionadas.
- NO puedes instalar más dependencias de las que se encuentran instaladas en este proyecto (a excepción de los componentes de shadcn ui, esos si puedes   instalarlos)
- NO puedes eliminar archivos del proyecto, solo puedes agregar o modificar archivos (El objetivo es simular un entorno de trabajo real)
- SI puedes consultar documentación 


# Backend

El desarrollo del backend es libre, el objetivo es crear los endpoints necesarios para que el frontend pueda consumir los datos de las tareas.

## Endpoints sugeridos

- GET /tasks - Obtener todas las tareas 
- GET /tasks/:id - Obtener una tarea por id
- POST /tasks - Crear una tarea
- PUT /tasks/:id - Actualizar una tarea
- DELETE /tasks/:id - Eliminar una tarea

## Conexión a la base de datos

El backend debe conectarse a la base de datos de MongoDB utilizando mongoose.

mongodb+srv://MeddiTest123:MeddiTest123.@checkpoint.lkqypk0.mongodb.net/?appName=checkpoint