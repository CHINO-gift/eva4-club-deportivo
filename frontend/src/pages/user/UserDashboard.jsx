function UserDashboard() {
  return (
    <section className="dashboard-grid">
      <div className="content-card hero-dashboard">
        <span className="section-kicker">Usuario</span>
        <h1>Reserva clases y organiza tus actividades</h1>
        <p>
          Desde este panel podrás revisar clases disponibles, crear reservas y cancelar
          reservas activas.
        </p>
      </div>

      <div className="stat-card">
        <span>Flujo usuario</span>
        <strong>Clases disponibles</strong>
        <p>Explora las clases disponibles del club.</p>
      </div>

      <div className="stat-card">
        <span>Flujo usuario</span>
        <strong>Mis Reservas</strong>
        <p>Consulta y cancela reservas cuando lo necesites.</p>
      </div>
    </section>
  )
}

export default UserDashboard