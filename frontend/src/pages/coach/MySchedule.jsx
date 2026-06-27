import { useEffect, useMemo, useState } from 'react'
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

function MySchedule() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatTime = (time) => {
    if (!time) {
      return ''
    }

    return String(time).slice(0, 5)
  }

  const groupedSchedules = useMemo(() => {
    const grouped = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: []
    }

    schedules.forEach((schedule) => {
      if (grouped[schedule.day_of_week]) {
        grouped[schedule.day_of_week].push(schedule)
      }
    })

    return grouped
  }, [schedules])

  const loadSchedules = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/coach/my-schedules')
      setSchedules(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo cargar tu horario')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchedules()
  }, [])

  return (
    <section className="content-card">
      <div className="section-header">
        <span className="section-kicker">Flujo coach</span>
        <h1>Mi Horario</h1>
        <p>Revisa tu planificación semanal con las clases asignadas por día y hora.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="empty-text">Cargando horario...</p>
      ) : schedules.length === 0 ? (
        <p className="empty-text">No tienes horarios asignados por el momento.</p>
      ) : (
        <div className="weekly-schedule">
          {Object.entries(dayNames).map(([dayNumber, dayName]) => (
            <article className="day-column" key={dayNumber}>
              <div className="day-header">
                <span>{dayName}</span>
                <strong>{groupedSchedules[dayNumber].length}</strong>
              </div>

              <div className="day-classes">
                {groupedSchedules[dayNumber].length === 0 ? (
                  <p className="empty-mini">Sin clases</p>
                ) : (
                  groupedSchedules[dayNumber].map((schedule) => (
                    <div className="day-class-card" key={schedule.id}>
                      <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                      <strong>{schedule.sportRoom?.sport?.name || 'Sin deporte'}</strong>
                      <p>{schedule.sportRoom?.room?.name || 'Sin sala'}</p>
                    </div>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MySchedule