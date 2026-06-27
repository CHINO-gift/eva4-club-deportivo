import { useEffect, useState } from 'react'
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

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [error, setError] = useState('')

  const formatTime = (time) => {
    if (!time) {
      return ''
    }

    return String(time).slice(0, 5)
  }

  const showError = (error, fallbackMessage) => {
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || fallbackMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#4f46e5'
    })
  }

  const getReservationInfo = (reservation) => {
    const schedule = reservation.classSchedule
    const sportRoom = schedule?.sportRoom

    return {
      schedule,
      sport: sportRoom?.sport,
      room: sportRoom?.room,
      coach: sportRoom?.coach
    }
  }

  const loadReservations = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/reservations/my-reservations')
      setReservations(response.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar tus reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleCancelReservation = async (reservation) => {
    const info = getReservationInfo(reservation)
    const sportName = info.sport?.name || 'esta clase'

    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `Cancelarás tu reserva de ${sportName}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setCancellingId(reservation.id)

    try {
      await api.patch(`/reservations/${reservation.id}/cancel`)

      await Swal.fire({
        title: 'Reserva cancelada',
        text: 'Tu reserva fue cancelada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadReservations()
    } catch (error) {
      showError(error, 'No se pudo cancelar la reserva')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <section className="content-card">
      <div className="section-header">
        <span className="section-kicker">Flujo usuario</span>
        <h1>Mis Reservas</h1>
        <p>Consulta tus reservas activas y cancela las que ya no necesites.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="reservations-list">
        {loading ? (
          <p className="empty-text">Cargando reservas...</p>
        ) : reservations.length === 0 ? (
          <p className="empty-text">Todavía no tienes reservas registradas.</p>
        ) : (
          reservations.map((reservation) => {
            const info = getReservationInfo(reservation)
            const isActive = reservation.status === 'active'

            return (
              <article className="reservation-card" key={reservation.id}>
                <div className="reservation-status-column">
                  <span className={`reservation-status ${isActive ? 'active' : 'cancelled'}`}>
                    {isActive ? 'Activa' : 'Cancelada'}
                  </span>

                  <strong>Reserva #{reservation.id}</strong>
                </div>

                <div className="reservation-main-info">
                  <h2>{info.sport?.name || 'Sin deporte'}</h2>
                  <p>{info.sport?.objective || 'Sin objetivo registrado'}</p>

                  <div className="reservation-detail-grid">
                    <div>
                      <span>Día</span>
                      <strong>{dayNames[info.schedule?.day_of_week] || 'Sin día'}</strong>
                    </div>

                    <div>
                      <span>Horario</span>
                      <strong>
                        {formatTime(info.schedule?.start_time)} - {formatTime(info.schedule?.end_time)}
                      </strong>
                    </div>

                    <div>
                      <span>Sala</span>
                      <strong>{info.room?.name || 'Sin sala'}</strong>
                    </div>

                    <div>
                      <span>Coach</span>
                      <strong>{info.coach?.full_name || info.coach?.email || 'Sin coach'}</strong>
                    </div>
                  </div>
                </div>

                <div className="reservation-actions">
                  {isActive ? (
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleCancelReservation(reservation)}
                      disabled={cancellingId === reservation.id}
                    >
                      {cancellingId === reservation.id ? 'Cancelando...' : 'Cancelar reserva'}
                    </button>
                  ) : (
                    <button className="btn btn-outline-secondary" disabled>
                      Reserva cancelada
                    </button>
                  )}
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default MyReservations