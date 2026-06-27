import { useEffect, useMemo, useState } from 'react'
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
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [reservingId, setReservingId] = useState(null)
  const [error, setError] = useState('')

  const activeReservationScheduleIds = useMemo(() => {
    return reservations
      .filter((reservation) => reservation.status === 'active')
      .map((reservation) => reservation.class_schedule_id)
  }, [reservations])

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

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [classesResponse, reservationsResponse] = await Promise.all([
        api.get('/member/classes'),
        api.get('/reservations/my-reservations')
      ])

      setClasses(classesResponse.data.data || [])
      setReservations(reservationsResponse.data.data || [])
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar las clases disponibles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleReserve = async (classItem, schedule) => {
    const sportName = classItem.sport?.name || 'clase'
    const roomName = classItem.room?.name || 'sala'
    const dayName = dayNames[schedule.day_of_week] || 'día seleccionado'

    const result = await Swal.fire({
      title: '¿Crear reserva?',
      text: `Reservarás ${sportName} en ${roomName}, ${dayName} de ${formatTime(schedule.start_time)} a ${formatTime(schedule.end_time)}.`,
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

    setReservingId(schedule.id)

    try {
      await api.post('/reservations', {
        class_schedule_id: schedule.id
      })

      await Swal.fire({
        title: 'Reserva creada',
        text: 'Tu reserva fue registrada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4f46e5'
      })

      await loadData()
    } catch (error) {
      showError(error, 'No se pudo crear la reserva')
    } finally {
      setReservingId(null)
    }
  }

  return (
    <section className="content-card">
      <div className="section-header">
        <span className="section-kicker">Flujo usuario</span>
        <h1>Clases Disponibles</h1>
        <p>Revisa las clases activas del club y crea reservas según los horarios disponibles.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="member-classes-grid">
        {loading ? (
          <p className="empty-text">Cargando clases disponibles...</p>
        ) : classes.length === 0 ? (
          <p className="empty-text">No hay clases disponibles por el momento.</p>
        ) : (
          classes.map((classItem) => (
            <article className="member-class-card" key={classItem.id}>
              <div className="member-class-top">
                <span className={`status-pill ${classItem.status ? 'active' : 'inactive'}`}>
                  {classItem.status ? 'Disponible' : 'No disponible'}
                </span>

                <span className="assignment-id">Clase #{classItem.id}</span>
              </div>

              <div className="member-class-main">
                <div>
                  <span>Deporte</span>
                  <h2>{classItem.sport?.name || 'Sin deporte'}</h2>
                  <p>{classItem.sport?.objective || 'Sin objetivo registrado'}</p>
                </div>

                <div className="member-class-duration">
                  <strong>{classItem.sport?.duration || 0}</strong>
                  <span>min</span>
                </div>
              </div>

              <div className="member-class-info">
                <div>
                  <span>Sala</span>
                  <strong>{classItem.room?.name || 'Sin sala'}</strong>
                  <p>{classItem.room?.location || 'Sin ubicación'}</p>
                </div>

                <div>
                  <span>Coach</span>
                  <strong>{classItem.coach?.full_name || classItem.coach?.email || 'Sin coach'}</strong>
                  <p>Responsable de la clase</p>
                </div>

                <div>
                  <span>Capacidad</span>
                  <strong>{classItem.room?.capacity || 0} cupos</strong>
                  <p>Capacidad de la sala</p>
                </div>
              </div>

              <div className="reservation-schedules">
                <span className="small-title">Horarios disponibles</span>

                {classItem.schedules?.length > 0 ? (
                  classItem.schedules.map((schedule) => {
                    const alreadyReserved = activeReservationScheduleIds.includes(schedule.id)

                    return (
                      <div className="reservation-schedule-row" key={schedule.id}>
                        <div>
                          <strong>{dayNames[schedule.day_of_week] || 'Sin día'}</strong>
                          <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                        </div>

                        <button
                          className={alreadyReserved ? 'btn btn-sm btn-success' : 'btn btn-sm btn-brand'}
                          onClick={() => handleReserve(classItem, schedule)}
                          disabled={alreadyReserved || reservingId === schedule.id}
                        >
                          {alreadyReserved
                            ? 'Reservado'
                            : reservingId === schedule.id
                              ? 'Reservando...'
                              : 'Reservar'}
                        </button>
                      </div>
                    )
                  })
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

export default AvailableClasses