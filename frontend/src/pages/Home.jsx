import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home-page">
      <nav className="home-navbar">
        <div className="brand-mark">
          <div className="brand-icon">CD</div>
          <div>
            <strong>Club Deportivo</strong>
            <span>Gestión inteligente</span>
          </div>
        </div>

        <div className="home-actions">
          <Link to="/login" className="btn btn-outline-light">
            Iniciar sesión
          </Link>
          <Link to="/register" className="btn btn-light">
            Crear cuenta
          </Link>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-badge">SPA React + API REST</span>
          <h1>Administra clases, reservas, coaches y espacios deportivos en un solo lugar.</h1>
          <p>
            Plataforma web para organizar la gestión de un club deportivo con paneles separados
            para administrador, coach y usuario.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn btn-brand">
              Entrar al sistema
            </Link>
            <Link to="/register" className="btn btn-soft">
              Registrarme
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="floating-card main">
            <span>Panel activo</span>
            <h3>Clases disponibles</h3>
            <p>Reserva, revisa horarios y gestiona tus actividades.</p>
          </div>

          <div className="floating-grid">
            <div className="mini-stat">
              <strong>8</strong>
              <span>Flujos</span>
            </div>
            <div className="mini-stat">
              <strong>3</strong>
              <span>Roles</span>
            </div>
            <div className="mini-stat">
              <strong>API</strong>
              <span>REST</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <article>
          <span>01</span>
          <h3>Administrador</h3>
          <p>Gestiona usuarios, deportes, salas, asignaciones y horarios.</p>
        </article>

        <article>
          <span>02</span>
          <h3>Coach</h3>
          <p>Consulta clases asignadas, horarios y planificación deportiva.</p>
        </article>

        <article>
          <span>03</span>
          <h3>Usuario</h3>
          <p>Revisa clases disponibles, crea reservas y cancela cuando sea necesario.</p>
        </article>
      </section>
    </main>
  )
}

export default Home