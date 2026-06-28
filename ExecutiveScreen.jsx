import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

function ExecutiveScreen({ workOrders }) {
  const [buildings, setBuildings] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api/buildings")
      .then((response) => response.json())
      .then((data) => setBuildings(data))
  }, [])

  const openOrders = workOrders.filter((w) => w.status === "Pending").length

  function statusClass(status) {
    if (status === "Critical") return "pill pill-critical"
    if (status === "Watch") return "pill pill-warning"
    return "pill pill-healthy"
  }

  const spendData = [
    { quarter: "Q1", predictive: 60, reactive: 10 },
    { quarter: "Q2", predictive: 90, reactive: 15 },
    { quarter: "Q3", predictive: 120, reactive: 20 },
    { quarter: "Q4", predictive: 40, reactive: 35 }
  ]

  const riskDrivers = [
    { title: "HVAC compressors, pre-2000 buildings", detail: "11 units flagged · avg. 23yr age · model confidence 91%", color: "#C75D3D" },
    { title: "Elevator hydraulics, residence halls", detail: "5 units flagged · vibration anomaly pattern", color: "#C8862A" },
    { title: "Electrical panels, Hartwell Hall", detail: "3 units flagged · thermal signature rising", color: "#C8862A" }
  ]

  return (
    <div className="app-shell">
      <div className="sidebar">
        <div className="brand">
          <div className="mark">Campus<span>Pulse</span></div>
          <div className="sub">Facility Intelligence</div>
        </div>
        <div className="role-badge">◆ Executive — Provost Office</div>
        <div className="sidebar-nav">
          <div className="section-label">Overview</div>
          <a className="current">▣ Portfolio Summary</a>
          <a>$ Budget & Spend</a>
          <a>⚠ Risk Register</a>
          <div className="section-label">Reports</div>
          <a>▤ Quarterly Report</a>
        </div>
        <div className="foot">v2.4 · Synced 2 min ago</div>
      </div>

      <div className="main-area">
        <div className="topbar">
          <div>
            <h1>Portfolio Summary</h1>
            <div className="meta">ALL BUILDINGS · SPRING SEMESTER 2026</div>
          </div>
          <div className="right">
            <div className="avatar">PO</div>
          </div>
        </div>

        <div style={{ padding: "26px 28px" }}>
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="label">Open Work Orders</div>
              <div className="value">{openOrders}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Buildings Tracked</div>
              <div className="value">{buildings.length}</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: "16px" }}>
            <div className="title" style={{ marginBottom: "10px" }}>Health by Building</div>
            <table>
              <thead>
                <tr><th>Facility</th><th>Health</th><th>Status</th></tr>
              </thead>
              <tbody>
                {buildings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.health}/100</td>
                    <td><span className={statusClass(b.status)}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ marginBottom: "16px" }}>
            <div className="title" style={{ marginBottom: "10px" }}>Spend: Predictive vs Reactive ($K, YTD)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={spendData}>
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="predictive" fill="#2D6E5E" name="Predictive" />
                <Bar dataKey="reactive" fill="#C75D3D" name="Reactive" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="title" style={{ marginBottom: "10px" }}>Top Risk Drivers This Quarter</div>
            {riskDrivers.map((d, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${d.color}`, paddingLeft: "12px", marginBottom: "12px" }}>
                <div style={{ fontWeight: "700", fontSize: "13.5px" }}>{d.title}</div>
                <div style={{ fontSize: "12px", color: "#5C6B7A" }}>{d.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveScreen