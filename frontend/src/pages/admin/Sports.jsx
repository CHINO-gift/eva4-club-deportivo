import { useEffect, useState } from 'react'
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
      duration: sport.duration || '',
      status: Boolean(sport.status)
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingSport(null)
    setFormData(emptyForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: formData.name,
      objective: formData.objective,
      duration: Number(formData.duration),
      status: formData.status
    }

    try {
      if (editingSport) {
        await api.put(`/sports/${editingSport.id}`, payload)

        await Swal.fire({
          title: 'Deporte actualizado',
          text: 'Los datos del deporte fueron guardados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      } else {
        await api.post('/sports', payload)

        await Swal.fire({
          title: 'Deporte creado',
          text: 'El deporte fue registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        })
      }

      closeForm()
      await loadSports()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar el deporte',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
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

      await Swal.fire({
        title: 'Deporte eliminado',
        text: 'El deporte fue eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadSports()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo eliminar el deporte',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
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
      await api.put(`/sports/${sport.id}`, payload)

      await Swal.fire({
        title: 'Estado actualizado',
        text: 'El estado del deporte fue actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadSports()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el estado',
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
          <h1>Gestión de Deportes</h1>
          <p>Administra las disciplinas deportivas disponibles dentro del club.</p>
        </div>

        <button className="btn btn-brand" onClick={openCreateForm}>
          Nuevo deporte
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="form-panel">
          <div className="form-panel-header">
            <div>
              <h2>{editingSport ? 'Editar deporte' : 'Crear deporte'}</h2>
              <p>{editingSport ? 'Modifica la información del deporte seleccionado.' : 'Completa los datos para agregar una nueva disciplina.'}</p>
            </div>

            <button className="btn btn-outline-secondary" onClick={closeForm}>
              Cerrar
            </button>
          </div>

          <form className="grid-form" onSubmit={handleSubmit}>
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

            <div className="form-actions">
              <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>
                Cancelar
              </button>

              <button className="btn btn-brand" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar deporte'}
              </button>
            </div>
          </form>
        </div>
      )}

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
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEditForm(sport)}>
                  Editar
                </button>

                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleToggleStatus(sport)}>
                  {sport.status ? 'Desactivar' : 'Activar'}
                </button>

                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sport)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default Sports