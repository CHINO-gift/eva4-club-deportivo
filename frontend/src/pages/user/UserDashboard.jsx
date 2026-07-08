import { Link } from 'react-router-dom'

function UserDashboard() {
  return (
    <section className="dashboard-home">
      <div className="home-hero user-home-hero">
        <div>
          <span className="section-kicker">Panel de usuario</span>
          <h1>Inicio</h1>
          <p>
            Bienvenido al sistema del club deportivo. Desde aquí puedes revisar
            clases disponibles, crear reservas y administrar tus actividades.
          </p>

          <div className="home-actions">
            <Link to="/user/classes" className="btn btn-brand">
              Crear reserva
            </Link>

            <Link to="/user/reservations" className="btn btn-outline-primary">
              Mis reservas
            </Link>
          </div>
        </div>

        <div className="home-hero-card">
          <span>Flujo principal</span>
          <strong>Reservas de clases</strong>
          <p>Busca una clase disponible y reserva tu cupo en pocos pasos.</p>
        </div>
      </div>

      <div className="home-grid">
        <article className="home-card">
          <div className="home-icon">🏃</div>
          <h2>Clases disponibles</h2>
          <p>Consulta las clases activas que puedes reservar como usuario.</p>
          <Link to="/user/classes" className="btn btn-sm btn-outline-primary">
            Ver clases
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">📅</div>
          <h2>Crear reserva</h2>
          <p>Selecciona una clase, confirma los datos y crea tu reserva.</p>
          <Link to="/user/classes" className="btn btn-sm btn-outline-primary">
            Reservar
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">✅</div>
          <h2>Mis reservas</h2>
          <p>Revisa tus reservas activas y cancela una reserva si lo necesitas.</p>
          <Link to="/user/reservations" className="btn btn-sm btn-outline-primary">
            Ver reservas
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">👤</div>
          <h2>Mi perfil</h2>
          <p>Actualiza tus datos personales dentro del sistema.</p>
          <Link to="/user/profile" className="btn btn-sm btn-outline-primary">
            Ver perfil
          </Link>
        </article>
      </div>
    </section>
  )
}

export default UserDashboard