import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import logoImage from '../assets/logo.png'
import adminImage from '../assets/admin.png'

function AdminLayout() {
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
          <img src={adminImage} alt="Administrador" />
          <div>
            <strong>{user?.full_name}</strong>
            <span>Administrador</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/users">Usuarios</NavLink>
          <NavLink to="/admin/sports">Deportes</NavLink>
          <NavLink to="/admin/rooms">Salas</NavLink>
          <NavLink to="/admin/sport-rooms">Asignaciones</NavLink>
          <NavLink to="/admin/class-schedules">Horarios</NavLink>
          <NavLink to="/admin/profile">Mi Perfil</NavLink>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">Panel de administración</span>
            <h2>Gestión general del club</h2>
          </div>

          <div className="topbar-profile">
            <img src={adminImage} alt="Administrador" />
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

export default AdminLayout