import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role?.toLowerCase()
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute