import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
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

function AvailableClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [reservingId, setReservingId] = useState(null)
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

  const formatTime = (time) => {
    if (!time) {
      return 'Sin hora'
    }

    return String(time).slice(0, 5)
  }

  const getSportRoom = (classSchedule) => {
    return classSchedule.sportRoom || classSchedule.sport_room || {}
  }

  const getSport = (classSchedule) => {
    const sportRoom = getSportRoom(classSchedule)
    return sportRoom.sport || {}
  }

  const getRoom = (classSchedule) => {
    const sportRoom = getSportRoom(classSchedule)
    return sportRoom.room || {}
  }

  const getCoach = (classSchedule) => {
    const sportRoom = getSportRoom(classSchedule)
    return sportRoom.coach || {}
  }

  const isClassActive = (classSchedule) => {
    const sportRoom = getSportRoom(classSchedule)
    const sport = getSport(classSchedule)
    const room = getRoom(classSchedule)
    const coach = getCoach(classSchedule)

    return (
      classSchedule.status !== false &&
      sportRoom.status !== false &&
      sport.status !== false &&
      room.status !== false &&
      coach.status !== false
    )
  }

  const loadClasses = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/class-schedules')
      const activeClasses = getData(response).filter((classSchedule) => isClassActive(classSchedule))
      setClasses(activeClasses)
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar las clases disponibles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  const handleCreateReservation = async (classSchedule) => {
    const sport = getSport(classSchedule)
    const room = getRoom(classSchedule)
    const coach = getCoach(classSchedule)

    const result = await Swal.fire({
      title: '¿Crear reserva?',
      html: `
        <p>Se creará una reserva para:</p>
        <strong>${sport.name || 'Clase sin deporte'}</strong><br>
        <span>${dayNames[classSchedule.day_of_week] || 'Sin día'} ${formatTime(classSchedule.start_time)} - ${formatTime(classSchedule.end_time)}</span><br>
        <span>Sala: ${room.name || 'Sin sala'}</span><br>
        <span>Coach: ${coach.full_name || 'Sin coach'}</span>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setReservingId(classSchedule.id)
    setError('')

    try {
      await api.post('/reservations', {
        class_schedule_id: classSchedule.id
      })

      await Swal.fire({
        title: 'Reserva creada',
        text: 'La reserva fue creada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      showError(error, 'No se pudo crear la reserva')
    } finally {
      setReservingId(null)
    }
  }

  return (
    <section className="content-card">
      <div className="section-header action-header">
        <div>
          <span className="section-kicker">Flujo usuario</span>
          <h1>Clases Disponibles</h1>
          <p>Revisa las clases activas del club y crea una reserva.</p>
        </div>

        <Link to="/user/reservations" className="btn btn-outline-primary">
          Ver mis reservas
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="schedules-grid">
        {loading ? (
          <p className="empty-text">Cargando clases disponibles...</p>
        ) : classes.length === 0 ? (
          <p className="empty-text">No hay clases disponibles para reservar.</p>
        ) : (
          classes.map((classSchedule) => {
            const sport = getSport(classSchedule)
            const room = getRoom(classSchedule)
            const coach = getCoach(classSchedule)

            return (
              <article className="schedule-card" key={classSchedule.id}>
                <div className="schedule-top">
                  <span className="status-pill active">Disponible</span>
                  <span className="assignment-id">Clase #{classSchedule.id}</span>
                </div>

                <div className="schedule-day">
                  <span>{dayNames[classSchedule.day_of_week] || 'Sin día'}</span>
                  <strong>
                    {formatTime(classSchedule.start_time)} - {formatTime(classSchedule.end_time)}
                  </strong>
                </div>

                <div className="schedule-info">
                  <div>
                    <span>Deporte</span>
                    <strong>{sport.name || 'Sin deporte'}</strong>
                  </div>

                  <div>
                    <span>Sala</span>
                    <strong>{room.name || 'Sin sala'}</strong>
                  </div>

                  <div>
                    <span>Coach</span>
                    <strong>{coach.full_name || 'Sin coach'}</strong>
                  </div>

                  <div>
                    <span>Capacidad sala</span>
                    <strong>{room.capacity || 0} cupos</strong>
                  </div>
                </div>

                <div className="schedule-actions">
                  <button
                    type="button"
                    className="btn btn-brand"
                    disabled={reservingId === classSchedule.id}
                    onClick={() => handleCreateReservation(classSchedule)}
                  >
                    {reservingId === classSchedule.id ? 'Reservando...' : 'Crear reserva'}
                  </button>

                  <Link to="/user/reservations" className="btn btn-outline-primary">
                    Mis reservas
                  </Link>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default AvailableClasses