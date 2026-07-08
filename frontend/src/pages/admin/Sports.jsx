import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import api from '../../api/api'

const emptyForm = {
  name: '',
  objective: '',
  duration: '',
  status: true
}

function Sports() {
  const [sports, setSports] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingSport, setEditingSport] = useState(null)
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

  const loadSports = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/sports')
      setSports(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar los deportes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSports()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const openCreateForm = () => {
    setEditingSport(null)
    setFormData(emptyForm)
    setShowForm(true)
    setError('')
  }

  const openEditForm = (sport) => {
    setEditingSport(sport)
    setFormData({
      name: sport.name || '',
      objective: sport.objective || '',
      duration: sport.duration ? String(sport.duration) : '',
      status: Boolean(sport.status)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingSport(null)
    setFormData(emptyForm)
  }

  const validateForm = () => {
    if (formData.name.trim().length < 3) {
      Swal.fire({
        title: 'Nombre inválido',
        text: 'El nombre del deporte debe tener al menos 3 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (formData.objective.trim().length < 5) {
      Swal.fire({
        title: 'Objetivo inválido',
        text: 'El objetivo debe tener al menos 5 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (!formData.duration || Number(formData.duration) < 1) {
      Swal.fire({
        title: 'Duración inválida',
        text: 'La duración debe ser mayor a 0 minutos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
      return false
    }

    if (Number(formData.duration) > 240) {
      Swal.fire({
        title: 'Duración muy larga',
        text: 'La duración no puede superar los 240 minutos.',
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
      name: formData.name.trim(),
      objective: formData.objective.trim(),
      duration: Number(formData.duration),
      status: formData.status
    }

    try {
      if (editingSport) {
        const response = await api.put(`/sports/${editingSport.id}`, payload)
        const updatedSport = response.data.data || {
          ...editingSport,
          ...payload
        }

        setSports((currentSports) =>
          currentSports.map((sport) =>
            sport.id === editingSport.id ? updatedSport : sport
          )
        )

        await Swal.fire({
          title: 'Deporte actualizado',
          text: 'Los datos del deporte fueron guardados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        const response = await api.post('/sports', payload)
        const createdSport = response.data.data

        if (createdSport) {
          setSports((currentSports) => [createdSport, ...currentSports])
        } else {
          await loadSports()
        }

        await Swal.fire({
          title: 'Deporte creado',
          text: 'El deporte fue registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      closeForm()
    } catch (error) {
      showError(error, 'No se pudo guardar el deporte')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: '¿Eliminar deporte?',
      text: `Se eliminará ${sport.name}. Esta acción no se puede deshacer.`,
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
      await api.delete(`/sports/${sport.id}`)

      setSports((currentSports) =>
        currentSports.filter((currentSport) => currentSport.id !== sport.id)
      )

      await Swal.fire({
        title: 'Deporte eliminado',
        text: 'El deporte fue eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      showError(error, 'No se pudo eliminar el deporte')
    }
  }

  const handleToggleStatus = async (sport) => {
    const result = await Swal.fire({
      title: sport.status ? '¿Desactivar deporte?' : '¿Activar deporte?',
      text: sport.status
        ? `El deporte ${sport.name} quedará inactivo.`
        : `El deporte ${sport.name} volverá a estar activo.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: sport.status ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setError('')

    const payload = {
      name: sport.name,
      objective: sport.objective,
      duration: Number(sport.duration),
      status: !sport.status
    }

    try {
      const response = await api.put(`/sports/${sport.id}`, payload)
      const updatedSport = response.data.data || {
        ...sport,
        status: !sport.status
      }

      setSports((currentSports) =>
        currentSports.map((currentSport) =>
          currentSport.id === sport.id ? updatedSport : currentSport
        )
      )

      await Swal.fire({
        title: 'Estado actualizado',
        text: 'El estado del deporte fue actualizado correctamente.',
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
          <span className="section-kicker">Base obligatoria</span>
          <h1>Gestión de Deportes</h1>
          <p>Administra las disciplinas deportivas disponibles dentro del club.</p>
        </div>

        <button className="btn btn-brand" onClick={openCreateForm}>
          Nuevo deporte
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="cards-list">
        {loading ? (
          <p className="empty-text">Cargando deportes...</p>
        ) : sports.length === 0 ? (
          <p className="empty-text">No hay deportes registrados.</p>
        ) : (
          sports.map((sport) => (
            <article className="sport-card" key={sport.id}>
              <div className="sport-card-main">
                <div>
                  <span className={`status-pill ${sport.status ? 'active' : 'inactive'}`}>
                    {sport.status ? 'Activo' : 'Inactivo'}
                  </span>

                  <h2>{sport.name}</h2>
                  <p>{sport.objective}</p>
                </div>

                <div className="duration-box">
                  <strong>{sport.duration}</strong>
                  <span>minutos</span>
                </div>
              </div>

              <div className="sport-card-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openEditForm(sport)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleToggleStatus(sport)}
                >
                  {sport.status ? 'Desactivar' : 'Activar'}
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(sport)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal show={showForm} onHide={closeForm} centered size="lg" backdrop="static">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>{editingSport ? 'Editar deporte' : 'Crear deporte'}</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            <p className="modal-helper-text">
              {editingSport
                ? 'Modifica la información del deporte seleccionado.'
                : 'Completa los datos para agregar una nueva disciplina.'}
            </p>

            <div className="grid-form">
              <div>
                <label className="form-label">Nombre del deporte</label>
                <input
                  type="text"
                  name="name"
                  className="form-control custom-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Fútbol, Yoga, Natación"
                  required
                />
              </div>

              <div>
                <label className="form-label">Duración en minutos</label>
                <input
                  type="number"
                  name="duration"
                  className="form-control custom-input"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="240"
                  placeholder="Ej: 60"
                  required
                />
              </div>

              <div className="full-field">
                <label className="form-label">Objetivo</label>
                <textarea
                  name="objective"
                  className="form-control custom-input"
                  value={formData.objective}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe el objetivo principal de este deporte"
                  required
                />
              </div>

              <label className="check-card">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Deporte activo</span>
              </label>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Guardando...' : editingSport ? 'Actualizar deporte' : 'Guardar deporte'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </section>
  )
}

export default Sports