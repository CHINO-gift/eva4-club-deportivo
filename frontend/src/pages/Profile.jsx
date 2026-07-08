import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { useAuth } from '../auth/AuthContext'
import adminImage from '../assets/admin.png'
import coachImage from '../assets/coach.png'
import userImage from '../assets/usuario.png'
import defaultImage from '../assets/perfil.png'

function Profile() {
  const { user, updateProfile } = useAuth()

  const profileImage = useMemo(() => {
    if (user?.role === 'admin') {
      return adminImage
    }

    if (user?.role === 'coach') {
      return coachImage
    }

    if (user?.role === 'user') {
      return userImage
    }

    return defaultImage
  }, [user])

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    birth_date: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const minBirthDate = '1900-01-01'

  const isFutureDate = (dateValue) => {
    const selectedDate = new Date(dateValue)
    const currentDate = new Date()

    selectedDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    return selectedDate > currentDate
  }

  const isTooOldDate = (dateValue) => {
    return dateValue < minBirthDate
  }

  const getAge = (dateValue) => {
    const birthDate = new Date(dateValue)
    const currentDate = new Date()

    let age = currentDate.getFullYear() - birthDate.getFullYear()
    const monthDifference = currentDate.getMonth() - birthDate.getMonth()

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age -= 1
    }

    return age
  }

  const validateForm = () => {
    if (formData.full_name.trim().length < 3) {
      Swal.fire({
        title: 'Nombre inválido',
        text: 'El nombre completo debe tener al menos 3 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.birth_date && isTooOldDate(formData.birth_date)) {
      Swal.fire({
        title: 'Fecha inválida',
        text: 'La fecha de nacimiento no puede ser anterior al año 1900.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.birth_date && isFutureDate(formData.birth_date)) {
      Swal.fire({
        title: 'Fecha inválida',
        text: 'La fecha de nacimiento no puede ser futura.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.birth_date && getAge(formData.birth_date) < 12) {
      Swal.fire({
        title: 'Edad no permitida',
        text: 'El usuario debe tener al menos 12 años.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    return true
  }

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        birth_date: user.birth_date ? String(user.birth_date).split('T')[0] : ''
      })
    }
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await updateProfile({
        full_name: formData.full_name.trim(),
        birth_date: formData.birth_date || null,
        metadata: user?.metadata || { sports: [] }
      })

      setMessage('Perfil actualizado correctamente')

      await Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tus datos fueron guardados correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="profile-page-card">
      <div className="profile-banner">
        <div>
          <span className="section-kicker">Cuenta personal</span>
          <h1>Mi Perfil</h1>
          <p>Revisa y actualiza tus datos principales del sistema.</p>
        </div>

        <div className="profile-avatar-card">
          <img src={profileImage} alt="Perfil" />
          <div>
            <strong>{user?.full_name}</strong>
            <span>{user?.role}</span>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="profile-form improved-profile-form" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            name="full_name"
            className="form-control custom-input"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control custom-input"
            value={formData.email}
            disabled
            readOnly
          />
          <small className="text-muted">
            El correo se muestra solo como información para evitar duplicados.
          </small>
        </div>

        <div>
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            name="birth_date"
            className="form-control custom-input"
            value={formData.birth_date}
            onChange={handleChange}
            min={minBirthDate}
            max={today}
          />
        </div>

        <div className="profile-summary">
          <span>Rol actual</span>
          <strong>{user?.role}</strong>
        </div>

        <button type="submit" className="btn btn-brand" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  )
}

export default Profile