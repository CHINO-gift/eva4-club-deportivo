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
import SportRooms from '../pages/admin/SportRooms'
import ClassSchedules from '../pages/admin/ClassSchedules'
import MyClasses from '../pages/coach/MyClasses'
import MySchedule from '../pages/coach/MySchedule'
import AvailableClasses from '../pages/user/AvailableClasses'
import MyReservations from '../pages/user/MyReservations'
import Profile from '../pages/Profile'

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
            <Route path="sport-rooms" element={<SportRooms />} />
            <Route path="class-schedules" element={<ClassSchedules />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
          <Route path="/coach" element={<CoachLayout />}>
            <Route index element={<CoachDashboard />} />
            <Route path="my-classes" element={<MyClasses />} />
            <Route path="my-schedule" element={<MySchedule />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="classes" element={<AvailableClasses />} />
            <Route path="reservations" element={<MyReservations />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes