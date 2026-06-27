import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    setLoading(true)

    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        birth_date: formData.birth_date || null,
        password: formData.password,
        metadata: {
          sports: []
        }
      })

      setSuccess('Cuenta creada correctamente. Serás enviado al login.')
      setTimeout(() => {
        navigate('/login')
      }, 1300)
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

          <form onSubmit={handleSubmit}>
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

            <button className="btn btn-brand w-100" disabled={loading}>
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