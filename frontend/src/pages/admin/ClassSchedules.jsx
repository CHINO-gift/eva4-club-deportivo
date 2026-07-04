import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import api from '../../api/api'

const emptyForm = {
  sport_room_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  status: true
}

const dayNames = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
}

function ClassSchedules() {
  const [schedules, setSchedules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingSchedule, setEditingSchedule] = useState(null)
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

  const formatTimeForInput = (time) => {
    if (!time) {
      return ''
    }

    return String(time).slice(0, 5)
  }

  const formatTimeForApi = (time) => {
    if (!time) {
      return ''
    }

    if (time.length === 5) {
      return `${time}:00`
    }

    return time
  }

  const getAssignmentLabel = (assignment) => {
    const sport = assignment.sport?.name || 'Sin deporte'
    const room = assignment.room?.name || 'Sin sala'
    const coach = assignment.coach?.full_name || 'Sin coach'

    return `${sport} / ${room} / ${coach}`
  }

  const getScheduleTitle = (schedule) => {
    const sport = schedule.sportRoom?.sport?.name || 'Sin deporte'
    const room = schedule.sportRoom?.room?.name || 'Sin sala'
    const coach = schedule.sportRoom?.coach?.full_name || 'Sin coach'

    return {
      sport,
      room,
      coach
    }
  }

  const loadInitialData = async () => {
    setLoading(true)
    setError('')

    try {
      const [schedulesResponse, assignmentsResponse] = await Promise.all([
        api.get('/class-schedules'),
        api.get('/sport-rooms')
      ])

      setSchedules(getData(schedulesResponse))
      setAssignments(getData(assignmentsResponse))
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar los horarios')
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
    setEditingSchedule(null)
    setFormData(emptyForm)
    setShowForm(true)
    setError('')
  }

  const openEditForm = (schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      sport_room_id: schedule.sport_room_id ? String(schedule.sport_room_id) : '',
      day_of_week: schedule.day_of_week ? String(schedule.day_of_week) : '',
      start_time: formatTimeForInput(schedule.start_time),
      end_time: formatTimeForInput(schedule.end_time),
      status: Boolean(schedule.status)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingSchedule(null)
    setFormData(emptyForm)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingSchedule(null)
    setFormData(emptyForm)
  }

  const validateForm = () => {
    if (!formData.sport_room_id) {
      Swal.fire({
        title: 'Selecciona una asignación',
        text: 'Debes elegir una relación entre deporte, sala y coach.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.day_of_week) {
      Swal.fire({
        title: 'Selecciona un día',
        text: 'Debes elegir el día de la semana del horario.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.start_time) {
      Swal.fire({
        title: 'Hora de inicio requerida',
        text: 'Debes ingresar la hora de inicio de la clase.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.end_time) {
      Swal.fire({
        title: 'Hora de término requerida',
        text: 'Debes ingresar la hora de término de la clase.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.start_time >= formData.end_time) {
      Swal.fire({
        title: 'Rango horario inválido',
        text: 'La hora de inicio debe ser menor que la hora de término.',
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
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: Number(formData.day_of_week),
      start_time: formatTimeForApi(formData.start_time),
      end_time: formatTimeForApi(formData.end_time),
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

      if (editingSchedule) {
        await api.put(`/class-schedules/${editingSchedule.id}`, payload)

        await Swal.fire({
          title: 'Horario actualizado',
          text: 'El horario fue guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        await api.post('/class-schedules', payload)

        await Swal.fire({
          title: 'Horario creado',
          text: 'El horario fue registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      resetForm()
      await loadInitialData()
    } catch (error) {
      showError(error, 'No se pudo guardar el horario')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (schedule) => {
    const scheduleTitle = getScheduleTitle(schedule)

    const result = await Swal.fire({
      title: '¿Eliminar horario?',
      text: `Se eliminará ${scheduleTitle.sport} el día ${dayNames[schedule.day_of_week]} de ${formatTimeForInput(schedule.start_time)} a ${formatTimeForInput(schedule.end_time)}.`,
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
      await api.delete(`/class-schedules/${schedule.id}`)

      await Swal.fire({
        title: 'Horario eliminado',
        text: 'El horario fue eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadInitialData()
    } catch (error) {
      showError(error, 'No se pudo eliminar el horario')
    }
  }

  const handleToggleStatus = async (schedule) => {
    const result = await Swal.fire({
      title: schedule.status ? '¿Desactivar horario?' : '¿Activar horario?',
      text: schedule.status
        ? 'Este horario dejará de estar disponible.'
        : 'Este horario volverá a estar disponible.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: schedule.status ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setError('')

    const payload = {
      sport_room_id: schedule.sport_room_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      status: !schedule.status
    }

    try {
      await api.put(`/class-schedules/${schedule.id}`, payload)

      await Swal.fire({
        title: 'Estado actualizado',
        text: 'El estado del horario fue actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadInitialData()
    } catch (error) {
      showError(error, 'No se pudo actualizar el estado')
    }
  }

  return (
    <section className="content-card">
      <div className="section-header action-header">
        <div>
          <span className="section-kicker">Flujo administrador</span>
          <h1>Gestión de Horarios</h1>
          <p>Define días y horarios para las clases creadas a partir de una asignación.</p>
        </div>

        <button className="btn btn-brand" onClick={openCreateForm}>
          Nuevo horario
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="schedules-grid">
        {loading ? (
          <p className="empty-text">Cargando horarios...</p>
        ) : schedules.length === 0 ? (
          <p className="empty-text">No hay horarios registrados.</p>
        ) : (
          schedules.map((schedule) => {
            const scheduleTitle = getScheduleTitle(schedule)

            return (
              <article className="schedule-card" key={schedule.id}>
                <div className="schedule-top">
                  <span className={`status-pill ${schedule.status ? 'active' : 'inactive'}`}>
                    {schedule.status ? 'Activo' : 'Inactivo'}
                  </span>

                  <span className="assignment-id">ID #{schedule.id}</span>
                </div>

                <div className="schedule-day">
                  <span>{dayNames[schedule.day_of_week]}</span>
                  <strong>
                    {formatTimeForInput(schedule.start_time)} - {formatTimeForInput(schedule.end_time)}
                  </strong>
                </div>

                <div className="schedule-info">
                  <div>
                    <span>Deporte</span>
                    <strong>{scheduleTitle.sport}</strong>
                  </div>

                  <div>
                    <span>Sala</span>
                    <strong>{scheduleTitle.room}</strong>
                  </div>

                  <div>
                    <span>Coach</span>
                    <strong>{scheduleTitle.coach}</strong>
                  </div>

                  <div>
                    <span>Reservas</span>
                    <strong>{schedule.reservations?.length || 0}</strong>
                  </div>
                </div>

                <div className="schedule-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openEditForm(schedule)}>
                    Editar
                  </button>

                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleToggleStatus(schedule)}>
                    {schedule.status ? 'Desactivar' : 'Activar'}
                  </button>

                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(schedule)}>
                    Eliminar
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>

      <Modal show={showForm} onHide={closeForm} centered size="xl" backdrop="static">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{editingSchedule ? 'Editar horario' : 'Crear horario'}</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            <p className="modal-helper-text">
              {editingSchedule
                ? 'Modifica el día, horario o asignación de esta clase.'
                : 'Selecciona una asignación y define el día y rango horario de la clase.'}
            </p>

            <div className="grid-form">
              <div className="full-field">
                <label className="form-label">Asignación</label>
                <select
                  name="sport_room_id"
                  className="form-select custom-input"
                  value={formData.sport_room_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona deporte / sala / coach</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {getAssignmentLabel(assignment)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Día de la semana</label>
                <select
                  name="day_of_week"
                  className="form-select custom-input"
                  value={formData.day_of_week}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un día</option>
                  {Object.entries(dayNames).map(([dayNumber, dayName]) => (
                    <option key={dayNumber} value={dayNumber}>
                      {dayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Estado</label>
                <label className="check-card schedule-check">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <span>Horario activo</span>
                </label>
              </div>

              <div>
                <label className="form-label">Hora de inicio</label>
                <input
                  type="time"
                  name="start_time"
                  className="form-control custom-input"
                  value={formData.start_time}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Hora de término</label>
                <input
                  type="time"
                  name="end_time"
                  className="form-control custom-input"
                  value={formData.end_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Guardando...' : editingSchedule ? 'Actualizar horario' : 'Guardar horario'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </section>
  )
}

export default ClassSchedules