import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import logoImage from '../assets/logo.png'
import coachImage from '../assets/coach.png'

function CoachLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo-box">
          <img src={logoImage} alt="SportClub" />
        </div>

        <div className="sidebar-user-card">
          <img src={coachImage} alt="Coach" />
          <div>
            <strong>{user?.full_name}</strong>
            <span>Coach</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/coach" end>Dashboard</NavLink>
          <NavLink to="/coach/my-classes">Mis Clases</NavLink>
          <NavLink to="/coach/my-schedule">Mi Horario</NavLink>
          <NavLink to="/coach/profile">Mi Perfil</NavLink>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">Panel del coach</span>
            <h2>Clases y planificación</h2>
          </div>

          <div className="topbar-profile">
            <img src={coachImage} alt="Coach" />
            <div>
              <span>{user?.full_name}</span>
              <strong>{user?.role}</strong>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </section>
    </div>
  )
}

export default CoachLayout