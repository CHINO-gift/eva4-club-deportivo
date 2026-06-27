import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import api from '../../api/api'

const emptyForm = {
  full_name: '',
  email: '',
  password: '',
  role: 'user',
  birth_date: '',
  must_change_password: false
}

function Users() {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/users')
      setUsers(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const openCreateForm = () => {
    setEditingUser(null)
    setFormData(emptyForm)
    setShowForm(true)
    setError('')
  }

  const openEditForm = (user) => {
    setEditingUser(user)
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user',
      birth_date: user.birth_date || '',
      must_change_password: Boolean(user.must_change_password)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData(emptyForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      birth_date: formData.birth_date || null,
      must_change_password: formData.must_change_password,
      metadata: {
        sports: []
      }
    }

    if (formData.password.trim()) {
      payload.password = formData.password
    }

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload)

        await Swal.fire({
          title: 'Usuario actualizado',
          text: 'Los datos del usuario fueron guardados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        await api.post('/users', {
          ...payload,
          password: formData.password
        })

        await Swal.fire({
          title: 'Usuario creado',
          text: 'El usuario fue registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      closeForm()
      await loadUsers()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar el usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${user.full_name}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setError('')

    try {
      await api.delete(`/users/${user.id}`)

      await Swal.fire({
        title: 'Usuario eliminado',
        text: 'El usuario fue eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadUsers()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo eliminar el usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  return (
    <section className="content-card">
      <div className="section-header action-header">
        <div>
          <span className="section-kicker">Base obligatoria</span>
          <h1>Gestión de Usuarios</h1>
          <p>Crea, edita y elimina usuarios del sistema según su rol.</p>
        </div>

        <button className="btn btn-brand" onClick={openCreateForm}>
          Nuevo usuario
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <div>
              <h2>{editingUser ? 'Editar usuario' : 'Crear usuario'}</h2>
              <p>{editingUser ? 'Modifica los datos del usuario seleccionado.' : 'Completa los datos para registrar un nuevo usuario.'}</p>
            </div>

            <button className="btn btn-outline-secondary" onClick={closeForm}>
              Cerrar
            </button>
          </div>

          <form className="grid-form" onSubmit={handleSubmit}>
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
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control custom-input"
                value={formData.password}
                onChange={handleChange}
                placeholder={editingUser ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
                required={!editingUser}
              />
            </div>

            <div>
              <label className="form-label">Rol</label>
              <select
                name="role"
                className="form-select custom-input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </select>
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

            <label className="check-card">
              <input
                type="checkbox"
                name="must_change_password"
                checked={formData.must_change_password}
                onChange={handleChange}
              />
              <span>Solicitar cambio de contraseña</span>
            </label>

            <div className="form-actions">
              <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>
                Cancelar
              </button>

              <button className="btn btn-brand" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        {loading ? (
          <p className="empty-text">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="empty-text">No hay usuarios registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Fecha nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.birth_date || 'Sin fecha'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEditForm(user)}>
                          Editar
                        </button>

                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Users