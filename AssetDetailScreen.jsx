import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function AssetDetailScreen({ asset, onBack }) {
  if (!asset) {
    return (
      <div style={{ padding: "26px 28px" }}>
        <p>No asset selected.</p>
        <button className="btn btn-secondary" onClick={onBack}>Back to Dashboard</button>
      </div>
    )
  }

  const currentRisk = asset.riskValue || 30
  const baseTemp = 45
  const trendData = []
  for (let day = 1; day <= 14; day++) {
    const progress = day / 14
    const temp = baseTemp + progress * (currentRisk / 100) * 30
    trendData.push({ day: `D${day}`, temperature: Math.round(temp * 10) / 10 })
  }

  // Model explanation factors — ranked, illustrative reasoning tied to this asset's data
  const explanationFactors = [
    { rank: 1, color: "rust", label: "Temperature trend", detail: "Sustained rise over the monitoring window, steepening recently" },
    { rank: 2, color: "amber", label: "Asset age", detail: `${asset.age_years || 14} years — past median expected component lifespan` },
    { rank: 3, color: "amber", label: "Vibration signature", detail: "Pattern partially matches past failure cases in training data" },
    { rank: 4, color: "steel", label: "Maintenance gap", detail: "Time since last service exceeds recommended interval" }
  ]

  const maintenanceHistory = [
    { date: "Jul 14, 2025", type: "Routine", by: "D. Santos", notes: "Filter replacement, lubrication" },
    { date: "Feb 02, 2025", type: "Repair", by: "M. Okoye", notes: "Belt tension adjusted after warning" },
    { date: "Aug 19, 2024", type: "Routine", by: "D. Santos", notes: "Annual inspection — passed" }
  ]

  return (
    <div className="app-shell">
      <div className="sidebar">
        <div className="brand">
          <div className="mark">Campus<span>Pulse</span></div>
          <div className="sub">Facility Intelligence</div>
        </div>
        <div className="role-badge">◆ Facility Manager</div>
        <div className="sidebar-nav">
          <div className="section-label">Operations</div>
          <a onClick={onBack}>▣ Dashboard</a>
          <a className="current">⚙ Assets & Equipment</a>
          <a>⚠ Predictions & Alerts</a>
          <a>☑ Work Orders</a>
        </div>
        <div className="foot">Logged in as J. Alabi</div>
      </div>

      <div className="main-area">
        <div className="topbar">
          <div>
            <h1>{asset.asset}</h1>
            <div className="meta">HARTWELL ENGINEERING HALL · HVAC SYSTEM</div>
          </div>
          <div className="right">
            <button className="btn btn-secondary" onClick={onBack}>← Back to Dashboard</button>
          </div>
        </div>

        <div style={{ padding: "26px 28px" }}>
          <div className="kpi-row" style={{ marginBottom: "16px" }}>
            <div className="kpi-card">
              <div className="label">Emergency Fault Risk</div>
              <div className="value" style={{ color: "#C75D3D" }}>{currentRisk}%</div>
            </div>
            <div className="kpi-card">
              <div className="label">Predicted RUL</div>
              <div className="value" style={{ fontSize: "20px" }}>{asset.detail?.split("est. ")[1] || "—"}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Severity</div>
              <span className={asset.severity === "critical" ? "pill pill-critical" : "pill pill-warning"}>
                {asset.severity}
              </span>
            </div>
          </div>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div className="card">
              <div className="title" style={{ marginBottom: "10px" }}>Sensor Trend — Temperature (14 days)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#C75D3D" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="title" style={{ marginBottom: "4px" }}>Model Explanation</div>
              <div style={{ fontSize: "12px", color: "#5C6B7A", marginBottom: "12px" }}>
                Why the model flagged this asset:
              </div>
              {explanationFactors.map((f) => (
                <div key={f.rank} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700",
                    background: f.color === "rust" ? "#F6E3DA" : f.color === "amber" ? "#F6E9D2" : "#EAEAEA",
                    color: f.color === "rust" ? "#C75D3D" : f.color === "amber" ? "#C8862A" : "#5C6B7A"
                  }}>
                    {f.rank}
                  </div>
                  <div style={{ fontSize: "12.5px" }}>
                    <b>{f.label}</b> — {f.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="title" style={{ marginBottom: "10px" }}>Maintenance History</div>
            <table>
              <thead>
                <tr><th>Date</th><th>Type</th><th>Performed by</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((m, i) => (
                  <tr key={i}>
                    <td>{m.date}</td>
                    <td><span className="chip" style={{ cursor: "default" }}>{m.type}</span></td>
                    <td>{m.by}</td>
                    <td>{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetDetailScreen