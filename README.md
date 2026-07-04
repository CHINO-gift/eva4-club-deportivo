# SportClub - Sistema de Gestión Deportiva

## Descripción del proyecto

SportClub es una aplicación web SPA desarrollada en React para la gestión de un club deportivo. El sistema permite administrar usuarios, deportes, salas, asignaciones, horarios, clases y reservas mediante el consumo de una API REST entregada por el docente.

La aplicación cuenta con autenticación, rutas protegidas y separación de funcionalidades según el rol del usuario: Administrador, Coach y Usuario.

## Repositorio

Repositorio GitHub:

```txt
https://github.com/CHINO-gift/eva4-club-deportivo
```

## Aplicación desplegada

Enlace AWS:

```txt
PENDIENTE_AGREGAR_LINK_AWS
```

## Integrantes del equipo

- José Villalobos
- David Araya

## Distribución de flujos desarrollados

| Integrante | Flujo | Rol |
|---|---|---|
| José Villalobos | Gestión de Salas | Administrador |
| José Villalobos | Gestión de Asignaciones | Administrador |
| José Villalobos | Gestión de Horarios | Administrador |
| José Villalobos | Mis Reservas / Cancelar Reserva | Usuario |
| David Araya | Mis Clases | Coach |
| David Araya | Mi Horario | Coach |
| David Araya | Clases Disponibles | Usuario |
| David Araya | Crear Reserva | Usuario |

## Resumen de responsabilidades

José Villalobos se encargó de los flujos con mayor complejidad administrativa y de gestión de datos relacionados, incluyendo la administración de salas, asignaciones entre deporte, sala y coach, creación de horarios y cancelación de reservas.

David Araya se encargó de los flujos de consulta y uso directo del sistema, incluyendo la visualización de clases del coach, horario del coach, clases disponibles para usuarios y creación de reservas.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Bootstrap
- React Bootstrap
- SweetAlert2
- CSS personalizado

### Backend

- Node.js
- Express.js
- Sequelize
- SQLite / MySQL
- JWT
- bcrypt

## Roles del sistema

### Administrador

El administrador puede gestionar la información principal del club deportivo:

- Usuarios
- Deportes
- Salas
- Asignaciones de deporte, sala y coach
- Horarios
- Perfil personal

### Coach

El coach puede revisar su planificación dentro del club:

- Mis clases asignadas
- Mi horario semanal
- Perfil personal

### Usuario

El usuario puede consultar y reservar clases:

- Clases disponibles
- Crear reservas
- Ver mis reservas
- Cancelar reservas
- Perfil personal

## Funcionalidades obligatorias implementadas

- Login
- Registro de usuario
- Gestión de usuarios
- Gestión de deportes
- Rutas protegidas
- Gestión de roles
- Mi perfil

## Flujos funcionales implementados

### Administración

1. Gestión de Salas
2. Gestión de Asignaciones
3. Gestión de Horarios

### Coach

4. Mis Clases
5. Mi Horario

### Usuario

6. Clases Disponibles
7. Crear Reserva
8. Mis Reservas / Cancelar Reserva

## Endpoints consumidos

### Autenticación

- POST `/api/auth/login`
- POST `/api/auth/register`
- GET `/api/auth/me`

### Usuarios

- GET `/api/users`
- GET `/api/users/:id`
- POST `/api/users`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

### Deportes

- GET `/api/sports`
- GET `/api/sports/:id`
- POST `/api/sports`
- PUT `/api/sports/:id`
- DELETE `/api/sports/:id`

### Salas

- GET `/api/rooms`
- GET `/api/rooms/:id`
- POST `/api/rooms`
- PUT `/api/rooms/:id`
- DELETE `/api/rooms/:id`

### Asignaciones

- GET `/api/sport-rooms`
- GET `/api/sport-rooms/:id`
- POST `/api/sport-rooms`
- PUT `/api/sport-rooms/:id`
- DELETE `/api/sport-rooms/:id`

### Horarios

- GET `/api/class-schedules`
- GET `/api/class-schedules/:id`
- POST `/api/class-schedules`
- PUT `/api/class-schedules/:id`
- DELETE `/api/class-schedules/:id`

### Coach

- GET `/api/coach/dashboard`
- GET `/api/coach/my-classes`
- GET `/api/coach/my-schedules`
- GET `/api/coach/my-rooms`

### Usuario y reservas

- GET `/api/member/classes`
- GET `/api/member/classes/:id`
- GET `/api/reservations/my-reservations`
- POST `/api/reservations`
- PATCH `/api/reservations/:id/cancel`

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/CHINO-gift/eva4-club-deportivo.git
cd eva4-club-deportivo
```

### 2. Ejecutar el backend

```bash
cd Backend
npm install
npm run dev
```

El backend debe quedar activo en:

```txt
http://localhost:3000
```

### 3. Ejecutar el frontend

Abrir otra terminal desde la carpeta principal del proyecto:

```bash
cd frontend
npm install
npm run dev
```

El frontend debe quedar activo en:

```txt
http://localhost:5173
```

## Usuarios de prueba

```txt
Admin:
admin1@demo.cl
12345678

Coach:
coach1@demo.cl
12345678

Usuario:
user1@demo.cl
12345678
```

## Pruebas recomendadas

### Administrador

Ingresar como administrador y probar:

- Crear, editar y eliminar usuarios
- Crear, editar y eliminar deportes
- Crear, editar y eliminar salas
- Crear, editar y eliminar asignaciones
- Crear, editar y eliminar horarios
- Activar y desactivar registros cuando corresponda

### Coach

Ingresar como coach y probar:

- Ver clases asignadas
- Ver horario semanal
- Ver perfil personal

### Usuario

Ingresar como usuario y probar:

- Ver clases disponibles
- Crear una reserva
- Ver la reserva creada
- Cancelar una reserva
- Ver perfil personal

## Estructura principal del proyecto

```txt
eva4-club-deportivo/
├── Backend/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── auth/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── coach/
│   │   │   └── user/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
├── README.md
└── PROPUESTA_FLUJOS.md
```

## Estado del proyecto

El proyecto cuenta con los módulos principales solicitados en la evaluación, consumo de API, autenticación con token, rutas protegidas por rol, diseño responsive básico, modales para creación y edición, SweetAlert2 para mensajes y manejo de errores.

## Despliegue

Para generar la versión de producción del frontend:

```bash
cd frontend
npm run build
```

Esto genera la carpeta:

```txt
frontend/dist
```

La aplicación debe ser desplegada en AWS según la guía entregada por el docente.

## Observación importante

El backend entregado por el docente no fue modificado. Todas las mejoras y funcionalidades fueron implementadas exclusivamente en el frontend.