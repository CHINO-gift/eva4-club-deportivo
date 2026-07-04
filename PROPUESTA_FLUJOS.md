# Propuesta de Flujos - SportClub

## Descripción general

La aplicación SportClub es una SPA desarrollada en React que consume una API REST para gestionar un club deportivo. El sistema está dividido en tres roles principales: Administrador, Coach y Usuario.

La base obligatoria del proyecto incluye login, registro, gestión de usuarios, gestión de deportes, rutas protegidas, gestión de roles y perfil personal.

Además, se implementan los 8 flujos funcionales solicitados para la evaluación.

---

## Flujos seleccionados

| N° | Flujo | Rol |
|---|---|---|
| 1 | Gestión de Salas | Administrador |
| 2 | Gestión de Asignaciones | Administrador |
| 3 | Gestión de Horarios | Administrador |
| 4 | Mis Clases | Coach |
| 5 | Mi Horario | Coach |
| 6 | Clases Disponibles | Usuario |
| 7 | Crear Reserva | Usuario |
| 8 | Mis Reservas / Cancelar Reserva | Usuario |

---

# Detalle de flujos

## 1. Gestión de Salas

| Elemento | Detalle |
|---|---|
| Pantalla | `/admin/rooms` |
| Acción del usuario | El administrador crea, edita, activa/desactiva o elimina una sala |
| Endpoint utilizado | `GET /api/rooms`, `POST /api/rooms`, `PUT /api/rooms/:id`, `DELETE /api/rooms/:id` |
| Resultado esperado | La sala queda registrada o actualizada visualmente en la interfaz |

### Explicación

Este flujo permite administrar los espacios físicos donde se realizan las clases deportivas. Cada sala contiene nombre, descripción, capacidad, ubicación, observación, imagen y estado.

---

## 2. Gestión de Asignaciones

| Elemento | Detalle |
|---|---|
| Pantalla | `/admin/sport-rooms` |
| Acción del usuario | El administrador relaciona un deporte, una sala y un coach |
| Endpoint utilizado | `GET /api/sport-rooms`, `POST /api/sport-rooms`, `PUT /api/sport-rooms/:id`, `DELETE /api/sport-rooms/:id` |
| Resultado esperado | Se crea o actualiza una asignación visible en la interfaz |

### Explicación

Este flujo permite asignar un deporte a una sala específica y a un coach responsable. Esta relación se utiliza posteriormente para crear horarios y clases.

---

## 3. Gestión de Horarios

| Elemento | Detalle |
|---|---|
| Pantalla | `/admin/class-schedules` |
| Acción del usuario | El administrador crea, edita, activa/desactiva o elimina horarios |
| Endpoint utilizado | `GET /api/class-schedules`, `POST /api/class-schedules`, `PUT /api/class-schedules/:id`, `DELETE /api/class-schedules/:id` |
| Resultado esperado | El horario queda disponible para coach y usuarios |

### Explicación

Este flujo permite definir el día de la semana, hora de inicio y hora de término de una clase. El horario se crea a partir de una asignación existente.

---

## 4. Mis Clases

| Elemento | Detalle |
|---|---|
| Pantalla | `/coach/my-classes` |
| Acción del usuario | El coach revisa las clases que tiene asignadas |
| Endpoint utilizado | `GET /api/coach/my-classes` |
| Resultado esperado | Se muestran las clases asociadas al coach autenticado |

### Explicación

El coach puede visualizar los deportes y salas que tiene asignados, junto con sus horarios correspondientes.

---

## 5. Mi Horario

| Elemento | Detalle |
|---|---|
| Pantalla | `/coach/my-schedule` |
| Acción del usuario | El coach revisa su planificación semanal |
| Endpoint utilizado | `GET /api/coach/my-schedules` |
| Resultado esperado | Se muestra el horario semanal del coach |

### Explicación

Este flujo organiza los horarios del coach por día de la semana, permitiendo revisar de forma clara su planificación.

---

## 6. Clases Disponibles

| Elemento | Detalle |
|---|---|
| Pantalla | `/user/classes` |
| Acción del usuario | El usuario visualiza las clases disponibles |
| Endpoint utilizado | `GET /api/member/classes` |
| Resultado esperado | Se muestran las clases activas disponibles para reservar |

### Explicación

El usuario puede revisar deportes, salas, coaches y horarios disponibles antes de realizar una reserva.

---

## 7. Crear Reserva

| Elemento | Detalle |
|---|---|
| Pantalla | `/user/classes` |
| Acción del usuario | El usuario presiona el botón Reservar |
| Endpoint utilizado | `POST /api/reservations` |
| Datos enviados | `class_schedule_id` |
| Resultado esperado | Se crea una reserva para el usuario autenticado |

### Explicación

Cuando el usuario reserva una clase, el frontend envía el ID del horario seleccionado al backend. Si la operación es correcta, se muestra una alerta de éxito y la clase queda marcada como reservada.

---

## 8. Mis Reservas / Cancelar Reserva

| Elemento | Detalle |
|---|---|
| Pantalla | `/user/reservations` |
| Acción del usuario | El usuario revisa sus reservas y puede cancelarlas |
| Endpoint utilizado | `GET /api/reservations/my-reservations`, `PATCH /api/reservations/:id/cancel` |
| Resultado esperado | La reserva aparece como activa o cancelada según la acción realizada |

### Explicación

El usuario puede consultar todas sus reservas y cancelar las que estén activas. Al cancelar, el estado cambia visualmente en la interfaz.

---

# Base obligatoria del proyecto

| Módulo | Pantalla | Endpoint |
|---|---|---|
| Login | `/login` | `POST /api/auth/login` |
| Registro | `/register` | `POST /api/auth/register` |
| Mi Perfil | `/admin/profile`, `/coach/profile`, `/user/profile` | `GET /api/auth/me`, `PUT /api/auth/me` |
| Gestión de Usuarios | `/admin/users` | `/api/users` |
| Gestión de Deportes | `/admin/sports` | `/api/sports` |
| Rutas protegidas | Todas las rutas privadas | Validación de token y rol |
| Gestión de roles | Admin, Coach, Usuario | Control desde frontend mediante rutas protegidas |

---

# Resultado esperado general

Al finalizar, el sistema debe permitir:

- Iniciar sesión según rol
- Redirigir al usuario al panel correspondiente
- Proteger rutas privadas
- Administrar usuarios y deportes
- Gestionar salas, asignaciones y horarios
- Visualizar clases y horarios del coach
- Visualizar clases disponibles para usuarios
- Crear y cancelar reservas
- Mostrar cambios visuales en la interfaz
- Manejar errores mediante alertas