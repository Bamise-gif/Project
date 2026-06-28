function TechnicianScreen({ workOrders, onCompleteWorkOrder }) {
  const pending = workOrders.filter((w) => w.status === "Pending")
  const done = workOrders.filter((w) => w.status === "Done")

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-top">
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px" }}>
                My Work Orders
              </div>
              <div className="mono" style={{ fontSize: "10px", color: "#5C6B7A" }}>D. SANTOS · HVAC/ELEC TEAM</div>
            </div>
            <div className="avatar" style={{ width: "30px", height: "30px", fontSize: "11px" }}>DS</div>
          </div>

          <div className="phone-body">
            <div className="kpi-strip">
              <div className="k"><div className="n">{pending.length}</div><div className="l">Pending</div></div>
              <div className="k"><div className="n">{done.length}</div><div className="l">Completed</div></div>
            </div>

            <h3 style={{ fontSize: "14px" }}>Pending</h3>
            {pending.map((w) => (
              <div className="card" key={w.id} style={{ marginBottom: "10px" }}>
                <div className="title">{w.asset}</div>
                <div className="detail">{w.detail}</div>
                <div style={{ fontSize: "12.5px", fontWeight: "600", marginBottom: "6px" }}>
                  Was this a real issue?
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-primary" onClick={() => onCompleteWorkOrder(w.id, "real_issue")}>
                    Yes, real issue
                  </button>
                  <button className="btn btn-secondary" onClick={() => onCompleteWorkOrder(w.id, "false_alarm")}>
                    False alarm
                  </button>
                </div>
              </div>
            ))}
            {pending.length === 0 && <p>No pending jobs.</p>}

            <h3 style={{ fontSize: "14px", marginTop: "20px" }}>Completed</h3>
            {done.map((w) => (
              <div key={w.id} className="report-item">
                <div className="title">✓ {w.asset}</div>
                <div className="status">
                  {w.outcome === "real_issue" ? "Confirmed real issue" : "Logged as false alarm"}
                </div>
              </div>
            ))}
            {done.length === 0 && <p>No completed jobs yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicianScreen