import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
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

  const today = new Date().toISOString().split('T')[0]
  const minBirthDate = '1900-01-01'

  const showError = (error, fallbackMessage) => {
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || fallbackMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#4f46e5'
    })
  }

  const formatDateForInput = (dateValue) => {
    if (!dateValue) {
      return ''
    }

    return String(dateValue).split('T')[0]
  }

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
      birth_date: formatDateForInput(user.birth_date),
      must_change_password: Boolean(user.must_change_password)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingUser(null)
    setFormData(emptyForm)
  }

  const isFutureDate = (dateValue) => {
    if (!dateValue) {
      return false
    }

    return dateValue > today
  }

  const isTooOldDate = (dateValue) => {
    if (!dateValue) {
      return false
    }

    return dateValue < minBirthDate
  }

  const getAge = (dateValue) => {
    const birthDate = new Date(`${dateValue}T00:00:00`)
    const currentDate = new Date()

    let age = currentDate.getFullYear() - birthDate.getFullYear()
    const monthDifference = currentDate.getMonth() - birthDate.getMonth()
    const dayDifference = currentDate.getDate() - birthDate.getDate()

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age -= 1
    }

    return age
  }

  const validateForm = () => {
    if (formData.full_name.trim().length < 3) {
      Swal.fire({
        title: 'Nombre inválido',
        text: 'El nombre debe tener al menos 3 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      Swal.fire({
        title: 'Correo inválido',
        text: 'Debes ingresar un correo electrónico válido.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!editingUser && formData.password.trim().length < 8) {
      Swal.fire({
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (editingUser && formData.password.trim() && formData.password.trim().length < 8) {
      Swal.fire({
        title: 'Contraseña inválida',
        text: 'Si cambias la contraseña, debe tener al menos 8 caracteres.',
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      birth_date: formData.birth_date || null,
      must_change_password: formData.must_change_password,
      metadata: {
        sports: []
      }
    }

    if (formData.password.trim()) {
      payload.password = formData.password.trim()
    }

    try {
      if (editingUser) {
        const response = await api.put(`/users/${editingUser.id}`, payload)
        const updatedUser = response.data.data || {
          ...editingUser,
          ...payload,
          password: undefined
        }

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === editingUser.id ? updatedUser : user
          )
        )

        await Swal.fire({
          title: 'Usuario actualizado',
          text: 'Los datos del usuario fueron guardados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        const response = await api.post('/users', payload)
        const createdUser = response.data.data

        if (createdUser) {
          setUsers((currentUsers) => [createdUser, ...currentUsers])
        } else {
          await loadUsers()
        }

        await Swal.fire({
          title: 'Usuario creado',
          text: 'El usuario fue registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      closeForm()
    } catch (error) {
      showError(error, 'No se pudo guardar el usuario')
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

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id)
      )

      await Swal.fire({
        title: 'Usuario eliminado',
        text: 'El usuario fue eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      showError(error, 'No se pudo eliminar el usuario')
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
                    <td>{formatDateForInput(user.birth_date) || 'Sin fecha'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditForm(user)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user)}
                        >
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

      <Modal show={showForm} onHide={closeForm} centered size="xl" backdrop="static">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{editingUser ? 'Editar usuario' : 'Crear usuario'}</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            <p className="modal-helper-text">
              {editingUser
                ? 'Modifica los datos del usuario seleccionado.'
                : 'Completa los datos para registrar un nuevo usuario.'}
            </p>

            <div className="grid-form">
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
                  min={minBirthDate}
                  max={today}
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
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Guardando...' : editingUser ? 'Actualizar usuario' : 'Guardar usuario'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </section>
  )
}

export default Users