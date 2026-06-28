const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()
app.use(cors())
app.use(express.json())

// GET all reports
app.get("/api/reports", (req, res) => {
  const reports = db.prepare("SELECT * FROM reports ORDER BY id DESC").all()
  res.json(reports)
})

// POST a new report
app.post("/api/reports", (req, res) => {
  const { location, category, description, urgency } = req.body
  const result = db.prepare(
    "INSERT INTO reports (location, category, description, urgency, status) VALUES (?, ?, ?, ?, ?)"
  ).run(location, category, description, urgency, "Pending")
  res.json({ id: result.lastInsertRowid })
})

app.get("/api/buildings", (req, res) => {
  const buildings = db.prepare("SELECT * FROM buildings").all()
  res.json(buildings)
})

// GET all work orders
app.get("/api/workorders", (req, res) => {
  const orders = db.prepare("SELECT * FROM work_orders ORDER BY id DESC").all()
  res.json(orders)
})

// POST a new work order
app.post("/api/workorders", (req, res) => {
  const { asset, detail } = req.body
  const result = db.prepare(
    "INSERT INTO work_orders (asset, detail, status) VALUES (?, ?, ?)"
  ).run(asset, detail, "Pending")
  res.json({ id: result.lastInsertRowid })
})

app.post("/api/predict", async (req, res) => {
  const response = await fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  })
  const data = await response.json()
  res.json(data)
})

// PATCH (update) a work order's status
app.patch("/api/workorders/:id", (req, res) => {
  const { status, outcome } = req.body
  db.prepare("UPDATE work_orders SET status = ?, outcome = ? WHERE id = ?").run(status, outcome, req.params.id)
  res.json({ success: true })
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})