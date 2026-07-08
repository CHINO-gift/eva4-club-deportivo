import { Link } from 'react-router-dom'

function UserDashboard() {
  return (
    <section className="dashboard-grid">
      <div className="content-card hero-dashboard">
        <span className="section-kicker">Panel de usuario</span>
        <h1>Bienvenido al portal de reservas</h1>
        <p>
          Desde este panel puedes revisar clases disponibles, crear reservas,
          ver tus reservas activas y cancelar una reserva cuando lo necesites.
        </p>

        <div className="hero-buttons mt-4">
          <Link to="/user/classes" className="btn btn-brand">
            Crear reserva
          </Link>

          <Link to="/user/reservations" className="btn btn-outline-primary">
            Ver mis reservas
          </Link>
        </div>
      </div>

      <article className="stat-card">
        <span>Flujo usuario</span>
        <strong>Clases disponibles</strong>
        <p>Consulta las clases activas que puedes reservar.</p>

        <Link to="/user/classes" className="btn btn-sm btn-outline-primary mt-3">
          Ver clases
        </Link>
      </article>

      <article className="stat-card">
        <span>Flujo usuario</span>
        <strong>Crear reserva</strong>
        <p>Selecciona una clase y crea una reserva asociada a tu usuario.</p>

        <Link to="/user/classes" className="btn btn-sm btn-outline-primary mt-3">
          Reservar
        </Link>
      </article>

      <article className="stat-card">
        <span>Flujo usuario</span>
        <strong>Mis reservas</strong>
        <p>Revisa tus reservas activas y canceladas.</p>

        <Link to="/user/reservations" className="btn btn-sm btn-outline-primary mt-3">
          Ver reservas
        </Link>
      </article>

      <article className="stat-card">
        <span>Perfil</span>
        <strong>Mi cuenta</strong>
        <p>Actualiza tu información personal dentro del sistema.</p>

        <Link to="/user/profile" className="btn btn-sm btn-outline-primary mt-3">
          Ver perfil
        </Link>
      </article>
    </section>
  )
}

export default UserDashboard