import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import logoImage from '../assets/logo.png'
import userImage from '../assets/usuario.png'

function UserLayout() {
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
          <img src={userImage} alt="Usuario" />
          <div>
            <strong>{user?.full_name}</strong>
            <span>Usuario</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/user" end>Dashboard</NavLink>
          <NavLink to="/user/classes">Clases Disponibles</NavLink>
          <NavLink to="/user/reservations">Mis Reservas</NavLink>
          <NavLink to="/user/profile">Mi Perfil</NavLink>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">Panel del usuario</span>
            <h2>Reservas y clases disponibles</h2>
          </div>

          <div className="topbar-profile">
            <img src={userImage} alt="Usuario" />
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

export default UserLayout