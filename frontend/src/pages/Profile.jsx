import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

function Profile() {
  const { user, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    birth_date: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        birth_date: user.birth_date || ''
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
    setLoading(true)

    try {
      await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
        birth_date: formData.birth_date || null,
        metadata: user?.metadata || { sports: [] }
      })

      setMessage('Perfil actualizado correctamente')
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="content-card">
      <div className="section-header">
        <span className="section-kicker">Cuenta personal</span>
        <h1>Mi Perfil</h1>
        <p>Revisa y actualiza tus datos principales del sistema.</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
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
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            name="birth_date"
            className="form-control custom-input"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>

        <div className="profile-summary">
          <span>Rol actual</span>
          <strong>{user?.role}</strong>
        </div>

        <button className="btn btn-brand" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  )
}

export default Profile