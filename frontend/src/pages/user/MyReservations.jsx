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

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
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

  const getSchedule = (reservation) => {
    return reservation.classSchedule || reservation.class_schedule || reservation.schedule || {}
  }

  const getSportRoom = (reservation) => {
    const schedule = getSchedule(reservation)
    return schedule.sportRoom || schedule.sport_room || {}
  }

  const getSport = (reservation) => {
    const sportRoom = getSportRoom(reservation)
    return sportRoom.sport || {}
  }

  const getRoom = (reservation) => {
    const sportRoom = getSportRoom(reservation)
    return sportRoom.room || {}
  }

  const getCoach = (reservation) => {
    const sportRoom = getSportRoom(reservation)
    return sportRoom.coach || {}
  }

  const formatTime = (time) => {
    if (!time) {
      return 'Sin hora'
    }

    return String(time).slice(0, 5)
  }

  const getReservationStatus = (status) => {
    if (!status) {
      return 'Sin estado'
    }

    if (status === 'active') {
      return 'Activa'
    }

    if (status === 'cancelled' || status === 'canceled') {
      return 'Cancelada'
    }

    return status
  }

  const isReservationActive = (status) => {
    return status === 'active'
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
    const sport = getSport(reservation)
    const schedule = getSchedule(reservation)

    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `Se cancelará la reserva de ${sport.name || 'esta clase'} ${dayNames[schedule.day_of_week] || ''} ${formatTime(schedule.start_time)}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6c757d'
    })

    if (!result.isConfirmed) {
      return
    }

    setError('')

    try {
      const response = await api.patch(`/reservations/${reservation.id}/cancel`)
      const updatedReservation = response.data.data || {
        ...reservation,
        status: 'cancelled'
      }

      setReservations((currentReservations) =>
        currentReservations.map((currentReservation) =>
          currentReservation.id === reservation.id ? updatedReservation : currentReservation
        )
      )

      await Swal.fire({
        title: 'Reserva cancelada',
        text: 'La reserva fue cancelada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })
    } catch (error) {
      showError(error, 'No se pudo cancelar la reserva')
    }
  }

  return (
    <section className="content-card">
      <div className="section-header action-header">
        <div>
          <span className="section-kicker">Flujo usuario</span>
          <h1>Mis Reservas</h1>
          <p>Revisa tus reservas activas, canceladas y crea nuevas reservas.</p>
        </div>

        <Link to="/user/classes" className="btn btn-brand">
          Nueva reserva
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="reservations-list">
        {loading ? (
          <p className="empty-text">Cargando reservas...</p>
        ) : reservations.length === 0 ? (
          <div className="empty-state-card">
            <h2>No tienes reservas todavía</h2>
            <p>Cuando reserves una clase, aparecerá en esta sección.</p>

            <Link to="/user/classes" className="btn btn-brand mt-3">
              Crear reserva
            </Link>
          </div>
        ) : (
          reservations.map((reservation) => {
            const schedule = getSchedule(reservation)
            const sport = getSport(reservation)
            const room = getRoom(reservation)
            const coach = getCoach(reservation)

            return (
              <article className="reservation-card" key={reservation.id}>
                <div className="reservation-status-column">
                  <span className={`reservation-status ${isReservationActive(reservation.status) ? 'active' : 'cancelled'}`}>
                    {getReservationStatus(reservation.status)}
                  </span>

                  <strong>Reserva #{reservation.id}</strong>
                </div>

                <div className="reservation-main-info">
                  <h2>{sport.name || 'Clase sin deporte'}</h2>
                  <p>{sport.objective || 'Sin descripción disponible'}</p>

                  <div className="reservation-detail-grid">
                    <div>
                      <span>Día</span>
                      <strong>{dayNames[schedule.day_of_week] || 'Sin día'}</strong>
                    </div>

                    <div>
                      <span>Horario</span>
                      <strong>
                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                      </strong>
                    </div>

                    <div>
                      <span>Sala</span>
                      <strong>{room.name || 'Sin sala'}</strong>
                    </div>

                    <div>
                      <span>Coach</span>
                      <strong>{coach.full_name || 'Sin coach'}</strong>
                    </div>
                  </div>
                </div>

                <div className="reservation-actions">
                  {isReservationActive(reservation.status) ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleCancelReservation(reservation)}
                    >
                      Cancelar reserva
                    </button>
                  ) : (
                    <span className="empty-mini">Reserva cancelada</span>
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