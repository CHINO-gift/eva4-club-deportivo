import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import api from '../../api/api'

const emptyForm = {
  sport_id: '',
  room_id: '',
  coach_id: '',
  observation: '',
  status: true
}

function SportRooms() {
  const [assignments, setAssignments] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [coaches, setCoaches] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingAssignment, setEditingAssignment] = useState(null)
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

  const getData = (response) => {
    return response.data.data || []
  }

  const loadInitialData = async () => {
    setLoading(true)
    setError('')

    try {
      const [assignmentsResponse, sportsResponse, roomsResponse, usersResponse] = await Promise.all([
        api.get('/sport-rooms'),
        api.get('/sports'),
        api.get('/rooms'),
        api.get('/users')
      ])

      const allUsers = getData(usersResponse)
      const coachUsers = allUsers.filter((user) => user.role?.toLowerCase() === 'coach')

      setAssignments(getData(assignmentsResponse))
      setSports(getData(sportsResponse))
      setRooms(getData(roomsResponse))
      setCoaches(coachUsers)
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar las asignaciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const openCreateForm = () => {
    setEditingAssignment(null)
    setFormData(emptyForm)
    setShowForm(true)
    setError('')
  }

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      sport_id: assignment.sport_id ? String(assignment.sport_id) : '',
      room_id: assignment.room_id ? String(assignment.room_id) : '',
      coach_id: assignment.coach_id ? String(assignment.coach_id) : '',
      observation: assignment.observation || '',
      status: Boolean(assignment.status)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingAssignment(null)
    setFormData(emptyForm)
  }

  const validateForm = () => {
    if (!formData.sport_id) {
      Swal.fire({
        title: 'Selecciona un deporte',
        text: 'Debes elegir el deporte que será asignado.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.room_id) {
      Swal.fire({
        title: 'Selecciona una sala',
        text: 'Debes elegir la sala donde se realizará la clase.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.coach_id) {
      Swal.fire({
        title: 'Selecciona un coach',
        text: 'Debes elegir el coach responsable de esta asignación.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.observation.length > 255) {
      Swal.fire({
        title: 'Observación muy larga',
        text: 'La observación no puede superar los 255 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    return true
  }

  const buildPayload = () => {
    return {
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id),
      observation: formData.observation.trim() || null,
      status: formData.status
    }
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

      if (editingAssignment) {
        const response = await api.put(`/sport-rooms/${editingAssignment.id}`, payload)
        const updatedAssignment = response.data.data || {
          ...editingAssignment,
          ...payload
        }

        setAssignments((currentAssignments) =>
          currentAssignments.map((assignment) =>
            assignment.id === editingAssignment.id ? updatedAssignment : assignment
          )
        )

        await Swal.fire({
          title: 'Asignación actualizada',
          text: 'La asignación fue guardada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        const response = await api.post('/sport-rooms', payload)
        const createdAssignment = response.data.data

        if (createdAssignment) {
          setAssignments((currentAssignments) => [createdAssignment, ...currentAssignments])
        } else {
          await loadInitialData()
        }

        await Swal.fire({
          title: 'Asignación creada',
          text: 'El deporte, sala y coach fueron asignados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      closeForm()
    } catch (error) {
      showError(error, 'No se pudo guardar la asignación')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (assignment) => {
    const sportName = assignment.sport?.name || 'deporte'
    const roomName = assignment.room?.name || 'sala'
    const coachName = assignment.coach?.full_name || 'coach'

    const result = await Swal.fire({
      title: '¿Eliminar asignación?',
      text: `Se eliminará la asignación ${sportName} en ${roomName} con ${coachName}.`,
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
      await api.delete(`/sport-rooms/${assignment.id}`)

      setAssignments((currentAssignments) =>
        currentAssignments.filter((currentAssignment) => currentAssignment.id !== assignment.id)
      )

      await Swal.fire({
        title: 'Asignación eliminada',
        text: 'La asignación fue eliminada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      showError(error, 'No se pudo eliminar la asignación')
    }
  }

  const handleToggleStatus = async (assignment) => {
    const result = await Swal.fire({
      title: assignment.status ? '¿Desactivar asignación?' : '¿Activar asignación?',
      text: assignment.status
        ? 'La asignación quedará inactiva.'
        : 'La asignación volverá a estar activa.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: assignment.status ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setError('')

    const payload = {
      sport_id: assignment.sport_id,
      room_id: assignment.room_id,
      coach_id: assignment.coach_id,
      observation: assignment.observation || null,
      status: !assignment.status
    }

    try {
      const response = await api.put(`/sport-rooms/${assignment.id}`, payload)
      const updatedAssignment = response.data.data || {
        ...assignment,
        status: !assignment.status
      }

      setAssignments((currentAssignments) =>
        currentAssignments.map((currentAssignment) =>
          currentAssignment.id === assignment.id ? updatedAssignment : currentAssignment
        )
      )

      await Swal.fire({
        title: 'Estado actualizado',
        text: 'El estado de la asignación fue actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      showError(error, 'No se pudo actualizar el estado')
    }
  }

  return (
    <section className="content-card">
      <div className="section-header action-header">
        <div>
          <span className="section-kicker">Flujo administrador</span>
          <h1>Gestión de Asignaciones</h1>
          <p>Relaciona un deporte con una sala y un coach responsable.</p>
        </div>

        <button className="btn btn-brand" onClick={openCreateForm}>
          Nueva asignación
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="assignments-grid">
        {loading ? (
          <p className="empty-text">Cargando asignaciones...</p>
        ) : assignments.length === 0 ? (
          <p className="empty-text">No hay asignaciones registradas.</p>
        ) : (
          assignments.map((assignment) => (
            <article className="assignment-card" key={assignment.id}>
              <div className="assignment-top">
                <span className={`status-pill ${assignment.status ? 'active' : 'inactive'}`}>
                  {assignment.status ? 'Activa' : 'Inactiva'}
                </span>

                <span className="assignment-id">ID #{assignment.id}</span>
              </div>

              <div className="assignment-flow">
                <div>
                  <span>Deporte</span>
                  <strong>{assignment.sport?.name || 'Sin deporte'}</strong>
                </div>

                <div className="flow-arrow">→</div>

                <div>
                  <span>Sala</span>
                  <strong>{assignment.room?.name || 'Sin sala'}</strong>
                </div>

                <div className="flow-arrow">→</div>

                <div>
                  <span>Coach</span>
                  <strong>{assignment.coach?.full_name || 'Sin coach'}</strong>
                </div>
              </div>

              <div className="assignment-details">
                <p>
                  <strong>Ubicación:</strong> {assignment.room?.location || 'Sin ubicación'}
                </p>

                <p>
                  <strong>Capacidad:</strong> {assignment.room?.capacity || 0} cupos
                </p>

                <p>
                  <strong>Observación:</strong> {assignment.observation || 'Sin observación'}
                </p>

                <p>
                  <strong>Horarios asociados:</strong> {assignment.schedules?.length || 0}
                </p>
              </div>

              <div className="assignment-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openEditForm(assignment)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning action-toggle-btn"
                  onClick={() => handleToggleStatus(assignment)}
                >
                  {assignment.status ? 'Desactivar' : 'Activar'}
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(assignment)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal show={showForm} onHide={closeForm} centered size="xl" backdrop="static">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{editingAssignment ? 'Editar asignación' : 'Crear asignación'}</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            <p className="modal-helper-text">
              {editingAssignment
                ? 'Modifica la relación entre deporte, sala y coach.'
                : 'Selecciona el deporte, la sala y el coach para crear una nueva asignación.'}
            </p>

            <div className="grid-form">
              <div>
                <label className="form-label">Deporte</label>
                <select
                  name="sport_id"
                  className="form-select custom-input"
                  value={formData.sport_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un deporte</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Sala</label>
                <select
                  name="room_id"
                  className="form-select custom-input"
                  value={formData.room_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una sala</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.location || 'Sin ubicación'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Coach</label>
                <select
                  name="coach_id"
                  className="form-select custom-input"
                  value={formData.coach_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un coach</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.full_name} - {coach.email}
                    </option>
                  ))}
                </select>
              </div>

              <label className="check-card">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Asignación activa</span>
              </label>

              <div className="full-field">
                <label className="form-label">Observación</label>
                <textarea
                  name="observation"
                  className="form-control custom-input"
                  value={formData.observation}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ej: Asignación para clases grupales de la tarde"
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Guardando...' : editingAssignment ? 'Actualizar asignación' : 'Guardar asignación'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </section>
  )
}

export default SportRooms