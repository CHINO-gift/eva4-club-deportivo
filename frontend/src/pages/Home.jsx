import { Link } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import userImage from '../assets/usuario.png'
import coachImage from '../assets/coach.png'
import adminImage from '../assets/admin.png'

function Home() {
  return (
    <main className="home-page">
      <nav className="home-navbar">
        <Link to="/" className="home-logo-card">
          <img src={logoImage} alt="SportClub" />
        </Link>

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
          <span className="hero-badge">Gestión deportiva moderna</span>

          <h1>Reserva, entrena y organiza tus actividades en un solo lugar.</h1>

          <p>
            SportClub permite administrar clases, salas, coaches, horarios y reservas
            de forma simple, visual y ordenada.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn btn-brand">
              Entrar al sistema
            </Link>
            <Link to="/register" className="btn btn-soft">
              Crear mi cuenta
            </Link>
          </div>

          <div className="home-trust-row">
            <div>
              <strong>Reservas</strong>
              <span>Agenda tus clases disponibles</span>
            </div>

            <div>
              <strong>Horarios</strong>
              <span>Consulta tu planificación semanal</span>
            </div>

            <div>
              <strong>Coaches</strong>
              <span>Organiza clases y salas asignadas</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orb orb-one"></div>
          <div className="hero-orb orb-two"></div>

          <div className="hero-image-card role-hero-card">
            <img src={userImage} alt="Usuario del club deportivo" />
          </div>

          <div className="home-role-card admin-floating">
            <img src={adminImage} alt="Administrador" />
            <div>
              <span>Admin</span>
              <strong>Gestiona el club</strong>
            </div>
          </div>

          <div className="home-role-card coach-floating">
            <img src={coachImage} alt="Coach" />
            <div>
              <span>Coach</span>
              <strong>Revisa tus clases</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <article>
          <div className="benefit-icon">01</div>
          <h3>Panel administrador</h3>
          <p>
            Controla usuarios, deportes, salas, asignaciones y horarios desde
            un panel claro y fácil de usar.
          </p>
        </article>

        <article>
          <div className="benefit-icon">02</div>
          <h3>Panel coach</h3>
          <p>
            Cada coach puede revisar sus clases asignadas y su planificación semanal
            sin depender de planillas externas.
          </p>
        </article>

        <article>
          <div className="benefit-icon">03</div>
          <h3>Panel usuario</h3>
          <p>
            Los usuarios pueden ver clases disponibles, crear reservas y cancelar
            actividades cuando lo necesiten.
          </p>
        </article>
      </section>
    </main>
  )
}

export default Home