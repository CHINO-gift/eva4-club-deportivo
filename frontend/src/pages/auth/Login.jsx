import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
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
    setLoading(true)

    try {
      const loggedUser = await login(formData.email, formData.password)
      const role = loggedUser.role?.toLowerCase()

      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'coach') {
        navigate('/coach')
      } else {
        navigate('/user')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <div className="auth-info">
          <Link to="/" className="back-link">Volver al inicio</Link>
          <span className="auth-badge">Acceso privado</span>
          <h1>Bienvenido de vuelta</h1>
          <p>
            Ingresa con tu cuenta para acceder al panel correspondiente según tu rol dentro del club.
          </p>

          <div className="demo-box">
            <strong>Usuarios de prueba</strong>
            <span>admin1@demo.cl / 12345678</span>
            <span>coach1@demo.cl / 12345678</span>
            <span>user1@demo.cl / 12345678</span>
          </div>
        </div>

        <div className="auth-card">
          <h2>Iniciar sesión</h2>
          <p>Usa tus credenciales para continuar</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
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
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="auth-footer">
            <span>¿No tienes cuenta?</span>
            <Link to="/register">Crear cuenta</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login