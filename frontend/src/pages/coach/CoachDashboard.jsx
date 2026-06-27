function CoachDashboard() {
  return (
    <section className="dashboard-grid">
      <div className="content-card hero-dashboard">
        <span className="section-kicker">Coach</span>
        <h1>Planificación de clases asignadas</h1>
        <p>
          En este panel podrás consultar tus clases, horarios y actividades asignadas
          dentro del club deportivo.
        </p>
      </div>

      <div className="stat-card">
        <span>Flujo coach</span>
        <strong>Mis Clases</strong>
        <p>Consulta las clases que tienes asignadas.</p>
      </div>

      <div className="stat-card">
        <span>Flujo coach</span>
        <strong>Mi Horario</strong>
        <p>Visualiza tu planificación semanal.</p>
      </div>
    </section>
  )
}

export default CoachDashboard