import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function ManagerScreen({ workOrders, onAddWorkOrder, onViewAsset }) {
  const [predictions, setPredictions] = useState([])

  const monitoredAssets = [
    { id: 1, asset: "Compressor 3 — Hartwell Roof", temperature: 68, vibration: 4.5, current_draw: 19, age_years: 14, days_since_maintenance: 45 },
    { id: 2, asset: "Elevator B hydraulics", temperature: 50, vibration: 3.1, current_draw: 16, age_years: 9, days_since_maintenance: 20 },
    { id: 3, asset: "Main panel B — Ground floor", temperature: 55, vibration: 2.3, current_draw: 17, age_years: 11, days_since_maintenance: 30 }
  ]

  // sensor dots for the building cross-section — illustrative, tied loosely to prediction severity
  const floors = [
    {
      name: "ROOF / HVAC",
      sensors: [
        { label: "Compressor 3 · 96°C · failure risk 84%", status: "critical" },
        { label: "Compressor 1 · 71°C", status: "warning" },
        { label: "Cooling tower · nominal", status: "healthy" },
        { label: "Exhaust fan A · nominal", status: "healthy" }
      ]
    },
    {
      name: "FLOOR 4",
      sensors: [
        { label: "Rm 412 · nominal", status: "healthy" },
        { label: "Rm 401 · offline 2d", status: "offline" },
        { label: "Corridor panel · nominal", status: "healthy" }
      ]
    },
    {
      name: "FLOOR 3",
      sensors: [
        { label: "Elevator B · vibration anomaly", status: "warning" },
        { label: "Rm 318 · nominal", status: "healthy" },
        { label: "Lab fume hood · nominal", status: "healthy" }
      ]
    },
    {
      name: "GROUND / ELEC",
      sensors: [
        { label: "Main panel B · thermal rise", status: "warning" },
        { label: "Main panel A · nominal", status: "healthy" },
        { label: "Backup gen · nominal", status: "healthy" }
      ]
    }
  ]

  useEffect(() => {
    Promise.all(
      monitoredAssets.map((a) =>
        fetch("http://localhost:3000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(a)
        }).then((response) => response.json())
      )
    ).then((results) => {
      const merged = monitoredAssets.map((a, index) => {
        const r = results[index]
        return {
          id: a.id,
          asset: a.asset,
          detail: `${r.emergency_fault_probability}% emergency fault risk · est. ${r.predicted_days_until_failure} days until failure`,
          severity: r.emergency_fault_probability > 50 ? "critical" : "warning",
          riskValue: r.emergency_fault_probability
        }
      })
      setPredictions(merged)
    })
  }, [])

  function createWorkOrder(prediction) {
    const newOrder = { asset: prediction.asset, detail: prediction.detail }
    onAddWorkOrder(newOrder)
    setPredictions(predictions.filter((p) => p.id !== prediction.id))
  }

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
          <a className="current">▣ Dashboard</a>
          <a>⌂ Buildings</a>
          <a>⚙ Assets & Equipment</a>
          <a>⚠ Predictions & Alerts</a>
          <a>☑ Work Orders</a>
          <a>👤 Technicians</a>
        </div>
        <div className="foot">Logged in as J. Alabi<br/>Facilities · West Campus</div>
      </div>

      <div className="main-area">
        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <div className="meta">WEST CAMPUS · LIVE</div>
          </div>
          <div className="right">
            <div className="avatar">JA</div>
          </div>
        </div>

        <div style={{ padding: "26px 28px" }}>
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="label">Active Predictions</div>
              <div className="value">{predictions.length}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Open Work Orders</div>
              <div className="value">{workOrders.filter((w) => w.status === "Pending").length}</div>
            </div>
          </div>

          <div className="card tag-corner" data-tag="LIVE SENSOR MAP" style={{ marginBottom: "16px" }}>
            <div className="title" style={{ marginBottom: "4px" }}>Hartwell Engineering Hall — Cross-Section</div>
            <div className="mono" style={{ fontSize: "11px", color: "#5C6B7A", marginBottom: "14px" }}>
              Hover a node for live reading
            </div>
            <div className="building-viz">
              {floors.map((floor) => (
                <div className="floor" key={floor.name}>
                  <div className="fname">{floor.name}</div>
                  <div className="sensors">
                    {floor.sensors.map((s, i) => (
                      <div key={i} className={`sensor-dot ${s.status}`} data-label={s.label}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="viz-legend">
              <div className="li"><span className="sw" style={{ background: "#2D6E5E" }}></span>Healthy</div>
              <div className="li"><span className="sw" style={{ background: "#C8862A" }}></span>Watch</div>
              <div className="li"><span className="sw" style={{ background: "#C75D3D" }}></span>Critical</div>
              <div className="li"><span className="sw" style={{ background: "#36424F" }}></span>Offline</div>
            </div>
          </div>

          {predictions.length > 0 && (
            <div className="card" style={{ marginBottom: "16px" }}>
              <div className="title" style={{ marginBottom: "10px" }}>Risk Comparison</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={predictions}>
                  <XAxis dataKey="asset" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="riskValue" fill="#C75D3D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <h3>Prediction Queue</h3>
          {predictions.map((p) => (
            <div className="card" key={p.id}>
              <div className="title" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => onViewAsset(p)}>
                {p.asset}
              </div>
              <div className="detail">{p.detail}</div>
              <button
                className={p.severity === "critical" ? "btn btn-rust" : "btn btn-secondary"}
                onClick={() => createWorkOrder(p)}
              >
                Create Work Order
              </button>
            </div>
          ))}
          {predictions.length === 0 && <p>Loading predictions...</p>}

          <h3 style={{ marginTop: "24px" }}>Work Orders</h3>
          <table>
            <thead>
              <tr><th>Asset</th><th>Status</th></tr>
            </thead>
            <tbody>
              {workOrders.map((w) => (
                <tr key={w.id}>
                  <td>{w.asset}</td>
                  <td>
                    <span className={w.status === "Done" ? "pill pill-healthy" : "pill pill-warning"}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workOrders.length === 0 && <p>No work orders yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default ManagerScreen