# Propuesta de Flujos - SportClub

## Descripción general

La aplicación SportClub es una SPA desarrollada en React que consume una API REST para gestionar un club deportivo.

El sistema está dividido en tres roles principales:

- Administrador
- Coach
- Usuario

La base obligatoria del proyecto incluye login, registro, gestión de usuarios, gestión de deportes, rutas protegidas, gestión de roles y perfil personal.

Además, se implementan los 8 flujos funcionales solicitados para la evaluación.

## Integrantes del equipo

- José Villalobos
- David Araya

## Distribución por integrante

| Integrante | Flujo | Pantalla | Rol |
|---|---|---|---|
| José Villalobos | Gestión de Salas | `/admin/rooms` | Administrador |
| José Villalobos | Gestión de Asignaciones | `/admin/sport-rooms` | Administrador |
| José Villalobos | Gestión de Horarios | `/admin/class-schedules` | Administrador |
| José Villalobos | Mis Reservas / Cancelar Reserva | `/user/reservations` | Usuario |
| David Araya | Mis Clases | `/coach/my-classes` | Coach |
| David Araya | Mi Horario | `/coach/my-schedule` | Coach |
| David Araya | Clases Disponibles | `/user/classes` | Usuario |
| David Araya | Crear Reserva | `/user/classes` | Usuario |

## Flujos seleccionados

| N° | Flujo | Rol | Integrante responsable |
|---|---|---|---|
| 1 | Gestión de Salas | Administrador | José Villalobos |
| 2 | Gestión de Asignaciones | Administrador | José Villalobos |
| 3 | Gestión de Horarios | Administrador | José Villalobos |
| 4 | Mis Clases | Coach | David Araya |
| 5 | Mi Horario | Coach | David Araya |
| 6 | Clases Disponibles | Usuario | David Araya |
| 7 | Crear Reserva | Usuario | David Araya |
| 8 | Mis Reservas / Cancelar Reserva | Usuario | José Villalobos |

---

# Detalle de flujos

## 1. Gestión de Salas

| Elemento | Detalle |
|---|---|
| Responsable | José Villalobos |
| Pantalla | `/admin/rooms` |
| Acción del usuario | El administrador crea, edita, activa, desactiva o elimina una sala |
| Endpoint utilizado | `GET /api/rooms`, `POST /api/rooms`, `PUT /api/rooms/:id`, `DELETE /api/rooms/:id` |
| Resultado esperado | La sala queda registrada, actualizada o eliminada visualmente en la interfaz |

### Explicación

Este flujo permite administrar los espacios físicos donde se realizan las clases deportivas. Cada sala contiene nombre, descripción, capacidad, ubicación, observación, imagen y estado.

La creación y edición se realiza mediante un modal de React Bootstrap. Las acciones importantes muestran mensajes mediante SweetAlert2 y la interfaz se actualiza sin recargar la página.

---

## 2. Gestión de Asignaciones

| Elemento | Detalle |
|---|---|
| Responsable | José Villalobos |
| Pantalla | `/admin/sport-rooms` |
| Acción del usuario | El administrador relaciona un deporte, una sala y un coach |
| Endpoint utilizado | `GET /api/sport-rooms`, `POST /api/sport-rooms`, `PUT /api/sport-rooms/:id`, `DELETE /api/sport-rooms/:id` |
| Resultado esperado | Se crea, actualiza o elimina una asignación visible en la interfaz |

### Explicación

Este flujo permite asignar un deporte a una sala específica y a un coach responsable. Esta relación es necesaria para crear posteriormente los horarios de las clases.

La pantalla muestra la relación entre deporte, sala y coach, además de la ubicación, capacidad, observación y cantidad de horarios asociados.

---

## 3. Gestión de Horarios

| Elemento | Detalle |
|---|---|
| Responsable | José Villalobos |
| Pantalla | `/admin/class-schedules` |
| Acción del usuario | El administrador crea, edita, activa, desactiva o elimina horarios |
| Endpoint utilizado | `GET /api/class-schedules`, `POST /api/class-schedules`, `PUT /api/class-schedules/:id`, `DELETE /api/class-schedules/:id` |
| Resultado esperado | El horario queda disponible para coach y usuarios |

### Explicación

Este flujo permite definir el día de la semana, hora de inicio y hora de término de una clase. El horario se crea a partir de una asignación existente entre deporte, sala y coach.

El horario activo permite que el coach lo vea en su panel y que el usuario pueda visualizar la clase disponible para reservar.

---

## 4. Mis Clases

| Elemento | Detalle |
|---|---|
| Responsable | David Araya |
| Pantalla | `/coach/my-classes` |
| Acción del usuario | El coach revisa las clases que tiene asignadas |
| Endpoint utilizado | `GET /api/coach/my-classes` |
| Resultado esperado | Se muestran las clases asociadas al coach autenticado |

### Explicación

El coach puede visualizar los deportes y salas que tiene asignados. Esta información depende de las asignaciones creadas previamente por el administrador.

Para que este flujo muestre información, debe existir una asignación activa asociada al mismo coach que inició sesión.

---

## 5. Mi Horario

| Elemento | Detalle |
|---|---|
| Responsable | David Araya |
| Pantalla | `/coach/my-schedule` |
| Acción del usuario | El coach revisa su planificación semanal |
| Endpoint utilizado | `GET /api/coach/my-schedules` |
| Resultado esperado | Se muestra el horario semanal del coach |

### Explicación

Este flujo organiza los horarios del coach por día de la semana, permitiendo revisar de forma clara su planificación.

Para que se visualicen datos, debe existir una asignación activa y al menos un horario activo creado para ese coach.

---

## 6. Clases Disponibles

| Elemento | Detalle |
|---|---|
| Responsable | David Araya |
| Pantalla | `/user/classes` |
| Acción del usuario | El usuario visualiza las clases disponibles |
| Endpoint utilizado | `GET /api/member/classes` |
| Resultado esperado | Se muestran las clases activas disponibles para reservar |

### Explicación

El usuario puede revisar deportes, salas, coaches y horarios disponibles antes de realizar una reserva.

La información mostrada proviene directamente del backend y depende de los horarios activos creados por el administrador.

---

## 7. Crear Reserva

| Elemento | Detalle |
|---|---|
| Responsable | David Araya |
| Pantalla | `/user/classes` |
| Acción del usuario | El usuario presiona el botón Reservar |
| Endpoint utilizado | `POST /api/reservations` |
| Datos enviados | `class_schedule_id` |
| Resultado esperado | Se crea una reserva para el usuario autenticado |

### Explicación

Cuando el usuario reserva una clase, el frontend envía el ID del horario seleccionado al backend.

Si la operación es correcta, se muestra una alerta de éxito mediante SweetAlert2 y la clase queda registrada como reserva del usuario.

---

## 8. Mis Reservas / Cancelar Reserva

| Elemento | Detalle |
|---|---|
| Responsable | José Villalobos |
| Pantalla | `/user/reservations` |
| Acción del usuario | El usuario revisa sus reservas y puede cancelarlas |
| Endpoint utilizado | `GET /api/reservations/my-reservations`, `PATCH /api/reservations/:id/cancel` |
| Resultado esperado | La reserva aparece como activa o cancelada según la acción realizada |

### Explicación

El usuario puede consultar todas sus reservas y cancelar las que estén activas.

Al cancelar una reserva, se solicita confirmación mediante SweetAlert2. Si la acción es exitosa, el estado cambia visualmente en la interfaz sin recargar la página.

---

# Base obligatoria del proyecto

| Módulo | Pantalla | Endpoint principal |
|---|---|---|
| Login | `/login` | `POST /api/auth/login` |
| Registro | `/register` | `POST /api/auth/register` |
| Mi Perfil | `/admin/profile`, `/coach/profile`, `/user/profile` | `GET /api/auth/me` |
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
- Crear reservas
- Cancelar reservas
- Mostrar cambios visuales en la interfaz
- Manejar errores mediante SweetAlert2
- Actualizar la interfaz sin recargar la página
- Mantener una estructura ordenada en componentes, páginas, rutas y servicios

---

# Resumen técnico

El frontend utiliza React con Vite, React Router DOM para navegación, Axios para consumo de API, Bootstrap y React Bootstrap para la interfaz, SweetAlert2 para retroalimentación visual y CSS personalizado para mejorar la experiencia de usuario.

El backend entregado por el docente no fue modificado. Todas las funcionalidades consumen los endpoints disponibles de la API REST.