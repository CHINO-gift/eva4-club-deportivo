function AdminDashboard() {
  return (
    <section className="dashboard-grid">
      <div className="content-card hero-dashboard">
        <span className="section-kicker">Administrador</span>
        <h1>Control general del club deportivo</h1>
        <p>
          Desde este panel puedes administrar usuarios, deportes, salas, asignaciones
          entre deportes, salas y coaches, además de configurar horarios.
        </p>
      </div>

      <div className="stat-card">
        <span>Base obligatoria</span>
        <strong>Usuarios</strong>
        <p>CRUD de usuarios del sistema.</p>
      </div>

      <div className="stat-card">
        <span>Base obligatoria</span>
        <strong>Deportes</strong>
        <p>Administración de disciplinas deportivas.</p>
      </div>

      <div className="stat-card">
        <span>Flujos admin</span>
        <strong>Salas</strong>
        <p>Gestión de espacios físicos.</p>
      </div>

      <div className="stat-card">
        <span>Flujos admin</span>
        <strong>Horarios</strong>
        <p>Planificación de clases.</p>
      </div>
    </section>
  )
}

export default AdminDashboard