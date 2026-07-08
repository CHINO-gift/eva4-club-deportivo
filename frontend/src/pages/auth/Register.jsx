import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../auth/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    birth_date: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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

    if (!formData.email.trim()) {
      Swal.fire({
        title: 'Correo requerido',
        text: 'Debes ingresar un correo electrónico.',
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

    if (formData.password.length < 8) {
      Swal.fire({
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    return true
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        birth_date: formData.birth_date || null,
        password: formData.password,
        metadata: {
          sports: []
        }
      })

      setSuccess('Cuenta creada correctamente. Serás enviado al login.')

      await Swal.fire({
        title: 'Cuenta creada',
        text: 'Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      navigate('/login')
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-wrapper reverse">
        <div className="auth-card">
          <h2>Crear cuenta</h2>
          <p>Regístrate como usuario del club</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                name="full_name"
                className="form-control custom-input"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control custom-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.cl"
                required
              />
            </div>

            <div className="mb-3">
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

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control custom-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>

            <button type="submit" className="btn btn-brand w-100" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarme'}
            </button>
          </form>

          <div className="auth-footer">
            <span>¿Ya tienes cuenta?</span>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </div>

        <div className="auth-info">
          <Link to="/" className="back-link">Volver al inicio</Link>
          <span className="auth-badge">Nuevo usuario</span>
          <h1>Únete al club</h1>
          <p>
            Al crear una cuenta podrás revisar clases disponibles, reservar actividades
            y consultar tus reservas desde tu panel personal.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register