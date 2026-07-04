import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import api from '../../api/api'

const emptyForm = {
  name: '',
  description: '',
  capacity: '',
  location: '',
  observation: '',
  image_url: '',
  status: true
}

function Rooms() {
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingRoom, setEditingRoom] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const showError = (error, fallbackMessage) => {
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || fallbackMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#4f46e5'
    })
  }

  const loadRooms = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/rooms')
      setRooms(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar las salas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const openCreateForm = () => {
    setEditingRoom(null)
    setFormData(emptyForm)
    setShowForm(true)
    setError('')
  }

  const openEditForm = (room) => {
    setEditingRoom(room)
    setFormData({
      name: room.name || '',
      description: room.description || '',
      capacity: room.capacity ? String(room.capacity) : '',
      location: room.location || '',
      observation: room.observation || '',
      image_url: room.image_url || '',
      status: Boolean(room.status)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingRoom(null)
    setFormData(emptyForm)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingRoom(null)
    setFormData(emptyForm)
  }

  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      capacity: Number(formData.capacity),
      location: formData.location.trim() || null,
      observation: formData.observation.trim() || null,
      image_url: formData.image_url.trim() || null,
      status: formData.status
    }
  }

  const validateForm = () => {
    if (formData.name.trim().length < 3) {
      Swal.fire({
        title: 'Nombre inválido',
        text: 'El nombre de la sala debe tener al menos 3 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.description.trim().length < 5) {
      Swal.fire({
        title: 'Descripción inválida',
        text: 'La descripción debe tener al menos 5 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.capacity || Number(formData.capacity) < 1) {
      Swal.fire({
        title: 'Capacidad inválida',
        text: 'La capacidad debe ser mayor a 0.',
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

    try {
      const payload = buildPayload()

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, payload)

        await Swal.fire({
          title: 'Sala actualizada',
          text: 'Los datos de la sala fueron guardados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        await api.post('/rooms', payload)

        await Swal.fire({
          title: 'Sala creada',
          text: 'La sala fue registrada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      resetForm()
      await loadRooms()
    } catch (error) {
      showError(error, 'No se pudo guardar la sala')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: '¿Eliminar sala?',
      text: `Se eliminará la sala ${room.name}. Esta acción no se puede deshacer.`,
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
      await api.delete(`/rooms/${room.id}`)

      await Swal.fire({
        title: 'Sala eliminada',
        text: 'La sala fue eliminada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadRooms()
    } catch (error) {
      showError(error, 'No se pudo eliminar la sala')
    }
  }

  const handleToggleStatus = async (room) => {
    const result = await Swal.fire({
      title: room.status ? '¿Desactivar sala?' : '¿Activar sala?',
      text: room.status
        ? `La sala ${room.name} quedará inactiva.`
        : `La sala ${room.name} volverá a estar activa.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: room.status ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setError('')

    const payload = {
      name: room.name,
      description: room.description,
      capacity: Number(room.capacity),
      location: room.location || null,
      observation: room.observation || null,
      image_url: room.image_url || null,
      status: !room.status
    }

    try {
      await api.put(`/rooms/${room.id}`, payload)

      await Swal.fire({
        title: 'Estado actualizado',
        text: 'El estado de la sala fue actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadRooms()
    } catch (error) {
      showError(error, 'No se pudo actualizar el estado')
    }
  }

  return (
    <section className="content-card">
      <div className="section-header action-header">
        <div>
          <span className="section-kicker">Flujo administrador</span>
          <h1>Gestión de Salas</h1>
          <p>Crea, edita y administra los espacios físicos donde se realizan las clases.</p>
        </div>

        <button className="btn btn-brand" onClick={openCreateForm}>
          Nueva sala
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="rooms-grid">
        {loading ? (
          <p className="empty-text">Cargando salas...</p>
        ) : rooms.length === 0 ? (
          <p className="empty-text">No hay salas registradas.</p>
        ) : (
          rooms.map((room) => (
            <article className="room-card" key={room.id}>
              <div className="room-image">
                {room.image_url ? (
                  <img src={room.image_url} alt={room.name} />
                ) : (
                  <div className="room-image-placeholder">
                    <span>CD</span>
                  </div>
                )}
              </div>

              <div className="room-body">
                <div className="room-title-row">
                  <div>
                    <span className={`status-pill ${room.status ? 'active' : 'inactive'}`}>
                      {room.status ? 'Activa' : 'Inactiva'}
                    </span>

                    <h2>{room.name}</h2>
                  </div>

                  <div className="capacity-chip">
                    <strong>{room.capacity}</strong>
                    <span>cupos</span>
                  </div>
                </div>

                <p>{room.description}</p>

                <div className="room-meta">
                  <span>Ubicación: {room.location || 'Sin ubicación'}</span>
                  <span>Observación: {room.observation || 'Sin observación'}</span>
                </div>

                <div className="room-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openEditForm(room)}>
                    Editar
                  </button>

                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleToggleStatus(room)}>
                    {room.status ? 'Desactivar' : 'Activar'}
                  </button>

                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(room)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal show={showForm} onHide={closeForm} centered size="xl" backdrop="static">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{editingRoom ? 'Editar sala' : 'Crear sala'}</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            <p className="modal-helper-text">
              {editingRoom
                ? 'Modifica los datos de la sala seleccionada.'
                : 'Completa los datos para registrar un nuevo espacio deportivo.'}
            </p>

            <div className="grid-form">
              <div>
                <label className="form-label">Nombre de la sala</label>
                <input
                  type="text"
                  name="name"
                  className="form-control custom-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Sala Funcional"
                  required
                />
              </div>

              <div>
                <label className="form-label">Capacidad</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-control custom-input"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ej: 25"
                  required
                />
              </div>

              <div>
                <label className="form-label">Ubicación</label>
                <input
                  type="text"
                  name="location"
                  className="form-control custom-input"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Primer piso"
                />
              </div>

              <div>
                <label className="form-label">URL de imagen</label>
                <input
                  type="text"
                  name="image_url"
                  className="form-control custom-input"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="Puedes dejarlo vacío"
                />
              </div>

              <div className="full-field">
                <label className="form-label">Descripción</label>
                <textarea
                  name="description"
                  className="form-control custom-input"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe el uso principal de la sala"
                  required
                />
              </div>

              <div className="full-field">
                <label className="form-label">Observación</label>
                <textarea
                  name="observation"
                  className="form-control custom-input"
                  value={formData.observation}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Ej: Cuenta con colchonetas, pesas o implementación especial"
                />
              </div>

              <label className="check-card">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Sala activa</span>
              </label>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Guardando...' : editingRoom ? 'Actualizar sala' : 'Guardar sala'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </section>
  )
}

export default Rooms