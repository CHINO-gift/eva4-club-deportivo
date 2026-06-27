import { useEffect, useState } from 'react'
import api from '../../api/api'

const dayNames = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
}

function MyClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatTime = (time) => {
    if (!time) {
      return ''
    }

    return String(time).slice(0, 5)
  }

  const loadClasses = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/coach/my-classes')
      setClasses(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar tus clases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  return (
    <section className="content-card">
      <div className="section-header">
        <span className="section-kicker">Flujo coach</span>
        <h1>Mis Clases</h1>
        <p>Consulta las clases que tienes asignadas como coach dentro del club.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="coach-classes-grid">
        {loading ? (
          <p className="empty-text">Cargando clases...</p>
        ) : classes.length === 0 ? (
          <p className="empty-text">No tienes clases asignadas por el momento.</p>
        ) : (
          classes.map((item) => (
            <article className="coach-class-card" key={item.id}>
              <div className="coach-card-top">
                <span className={`status-pill ${item.status ? 'active' : 'inactive'}`}>
                  {item.status ? 'Activa' : 'Inactiva'}
                </span>

                <span className="assignment-id">Asignación #{item.id}</span>
              </div>

              <div className="coach-class-main">
                <div>
                  <span>Deporte</span>
                  <h2>{item.sport?.name || 'Sin deporte'}</h2>
                  <p>{item.sport?.objective || 'Sin objetivo registrado'}</p>
                </div>

                <div className="coach-class-duration">
                  <strong>{item.sport?.duration || 0}</strong>
                  <span>min</span>
                </div>
              </div>

              <div className="coach-room-box">
                <span>Sala asignada</span>
                <strong>{item.room?.name || 'Sin sala'}</strong>
                <p>{item.room?.location || 'Sin ubicación'} · Capacidad {item.room?.capacity || 0} personas</p>
              </div>

              <div className="coach-schedules-list">
                <span className="small-title">Horarios</span>

                {item.schedules?.length > 0 ? (
                  item.schedules.map((schedule) => (
                    <div className="coach-schedule-row" key={schedule.id}>
                      <strong>{dayNames[schedule.day_of_week] || 'Sin día'}</strong>
                      <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-mini">Esta clase aún no tiene horarios activos.</p>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default MyClasses