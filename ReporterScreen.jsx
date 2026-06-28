import { useState } from "react"

function ReporterScreen({ reports, onAddReport }) {
  const [location, setLocation] = useState("Meridian Library — 2nd Floor")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Plumbing")
  const [urgency, setUrgency] = useState("Soon")

  const categories = ["Electrical", "Plumbing", "HVAC / Temp", "Structural", "Cleaning", "Other"]
  const urgencyLevels = ["Can wait", "Soon", "Urgent / Safety"]

  function handleSubmit() {
    fetch("http://localhost:3000/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, category, description, urgency })
    })
      .then((response) => response.json())
      .then(() => {
        onAddReport({ title: description || "(no description)", status: "Just now · Pending" })
        setDescription("")
      })
  }

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-top">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px" }}>
              Report an Issue
            </div>
          </div>

          <div className="phone-body">
            <div className="field">
              <label>Where is the problem?</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="field">
              <label>What kind of issue?</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={category === c ? "chip selected" : "chip"}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Describe what's happening</label>
              <textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="field">
              <label>How urgent is this?</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {urgencyLevels.map((u) => (
                  <button
                    key={u}
                    className={urgency === u ? "chip selected" : "chip"}
                    onClick={() => setUrgency(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }} onClick={handleSubmit}>
              Submit Report
            </button>

            <h3 style={{ marginTop: "24px", fontSize: "14px" }}>Your Recent Reports</h3>
            {reports.map((r, index) => (
              <div key={index} className="report-item">
                <div className="title">{r.title}</div>
                <div className="status">{r.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReporterScreen