import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <section className="dashboard-home">
      <div className="home-hero admin-home-hero">
        <div>
          <span className="section-kicker">Panel de administrador</span>
          <h1>Inicio</h1>
          <p>
            Administra la información principal del club deportivo: usuarios,
            deportes, salas, asignaciones y horarios de clases.
          </p>

          <div className="home-actions">
            <Link to="/admin/users" className="btn btn-brand">
              Gestionar usuarios
            </Link>

            <Link to="/admin/class-schedules" className="btn btn-outline-primary">
              Ver horarios
            </Link>
          </div>
        </div>

        <div className="home-hero-card">
          <span>Administración</span>
          <strong>Control general</strong>
          <p>Configura la base operativa del sistema deportivo.</p>
        </div>
      </div>

      <div className="home-grid">
        <article className="home-card">
          <div className="home-icon">👥</div>
          <h2>Usuarios</h2>
          <p>Crea, edita y elimina usuarios según su rol dentro del sistema.</p>
          <Link to="/admin/users" className="btn btn-sm btn-outline-primary">
            Gestionar
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">⚽</div>
          <h2>Deportes</h2>
          <p>Administra las disciplinas deportivas disponibles en el club.</p>
          <Link to="/admin/sports" className="btn btn-sm btn-outline-primary">
            Gestionar
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">🏟️</div>
          <h2>Salas</h2>
          <p>Registra y administra los espacios físicos donde se realizan clases.</p>
          <Link to="/admin/rooms" className="btn btn-sm btn-outline-primary">
            Gestionar
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">🔗</div>
          <h2>Asignaciones</h2>
          <p>Relaciona deporte, sala y coach para organizar las clases.</p>
          <Link to="/admin/sport-rooms" className="btn btn-sm btn-outline-primary">
            Gestionar
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">🕒</div>
          <h2>Horarios</h2>
          <p>Define los días y horarios disponibles para cada clase.</p>
          <Link to="/admin/class-schedules" className="btn btn-sm btn-outline-primary">
            Gestionar
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">👤</div>
          <h2>Mi perfil</h2>
          <p>Consulta y actualiza la información de tu cuenta.</p>
          <Link to="/admin/profile" className="btn btn-sm btn-outline-primary">
            Ver perfil
          </Link>
        </article>
      </div>
    </section>
  )
}

export default AdminDashboard