import { Link } from 'react-router-dom'

function CoachDashboard() {
  return (
    <section className="dashboard-home">
      <div className="home-hero coach-home-hero">
        <div>
          <span className="section-kicker">Panel de coach</span>
          <h1>Inicio</h1>
          <p>
            Revisa tus clases asignadas, consulta tus horarios y mantén organizada
            tu participación dentro del club deportivo.
          </p>

          <div className="home-actions">
            <Link to="/coach/classes" className="btn btn-brand">
              Mis clases
            </Link>

            <Link to="/coach/schedule" className="btn btn-outline-primary">
              Mi horario
            </Link>
          </div>
        </div>

        <div className="home-hero-card">
          <span>Flujo coach</span>
          <strong>Clases asignadas</strong>
          <p>Consulta las clases que tienes asignadas y sus horarios.</p>
        </div>
      </div>

      <div className="home-grid">
        <article className="home-card">
          <div className="home-icon">🏋️</div>
          <h2>Mis clases</h2>
          <p>Revisa las clases deportivas asignadas a tu usuario coach.</p>
          <Link to="/coach/classes" className="btn btn-sm btn-outline-primary">
            Ver clases
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">🕒</div>
          <h2>Mi horario</h2>
          <p>Consulta los días, horas y salas donde tienes clases programadas.</p>
          <Link to="/coach/schedule" className="btn btn-sm btn-outline-primary">
            Ver horario
          </Link>
        </article>

        <article className="home-card">
          <div className="home-icon">👤</div>
          <h2>Mi perfil</h2>
          <p>Actualiza tus datos personales dentro del sistema.</p>
          <Link to="/coach/profile" className="btn btn-sm btn-outline-primary">
            Ver perfil
          </Link>
        </article>
      </div>
    </section>
  )
}

export default CoachDashboard