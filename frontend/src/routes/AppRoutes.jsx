import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../auth/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AdminLayout from '../layouts/AdminLayout'
import CoachLayout from '../layouts/CoachLayout'
import UserLayout from '../layouts/UserLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import CoachDashboard from '../pages/coach/CoachDashboard'
import UserDashboard from '../pages/user/UserDashboard'
import Users from '../pages/admin/Users'
import Sports from '../pages/admin/Sports'
import Rooms from '../pages/admin/Rooms'
import Profile from '../pages/Profile'

function Placeholder({ title, description }) {
  return (
    <section className="content-card">
      <div className="section-header">
        <span className="section-kicker">Próximo avance</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="sports" element={<Sports />} />
            <Route path="rooms" element={<Rooms />} />
            <Route
              path="sport-rooms"
              element={<Placeholder title="Gestión de Asignaciones" description="Aquí se implementará la asignación de deporte, sala y coach." />}
            />
            <Route
              path="class-schedules"
              element={<Placeholder title="Gestión de Horarios" description="Aquí se implementará la administración de horarios." />}
            />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
          <Route path="/coach" element={<CoachLayout />}>
            <Route index element={<CoachDashboard />} />
            <Route
              path="my-classes"
              element={<Placeholder title="Mis Clases" description="Aquí el coach visualizará sus clases asignadas." />}
            />
            <Route
              path="my-schedule"
              element={<Placeholder title="Mi Horario" description="Aquí el coach visualizará sus horarios." />}
            />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route
              path="classes"
              element={<Placeholder title="Clases Disponibles" description="Aquí el usuario podrá revisar y reservar clases." />}
            />
            <Route
              path="reservations"
              element={<Placeholder title="Mis Reservas" description="Aquí el usuario podrá revisar y cancelar reservas." />}
            />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes