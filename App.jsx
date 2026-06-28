import { useState, useEffect } from "react"
import ReporterScreen from "./ReporterScreen"
import ManagerScreen from "./ManagerScreen"
import TechnicianScreen from "./TechnicianScreen"
import ExecutiveScreen from "./ExecutiveScreen"
import AssetDetailScreen from "./AssetDetailScreen"

function App() {
  const [currentScreen, setCurrentScreen] = useState("reporter")
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [reports, setReports] = useState([])
  const [workOrders, setWorkOrders] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api/reports")
      .then((response) => response.json())
      .then((data) => {
        const formatted = data.map((r) => ({
          title: r.description || "(no description)",
          status: r.status
        }))
        setReports(formatted)
      })
  }, [])

  useEffect(() => {
    fetch("http://localhost:3000/api/workorders")
      .then((response) => response.json())
      .then((data) => {
        setWorkOrders(data)
      })
  }, [])

  function addReport(newReport) {
    setReports([newReport, ...reports])
  }

  function addWorkOrder(newOrder) {
    fetch("http://localhost:3000/api/workorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset: newOrder.asset, detail: newOrder.detail })
    })
      .then((response) => response.json())
      .then((data) => {
        const savedOrder = { ...newOrder, id: data.id, status: "Pending" }
        setWorkOrders([savedOrder, ...workOrders])
      })
  }

  function completeWorkOrder(id, outcome) {
    fetch(`http://localhost:3000/api/workorders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Done", outcome })
    }).then(() => {
      setWorkOrders(
        workOrders.map((w) => (w.id === id ? { ...w, status: "Done", outcome } : w))
      )
    })
  }

  function viewAssetDetail(asset) {
    setSelectedAsset(asset)
    setCurrentScreen("assetDetail")
  }

  return (
    <div>
      <div className="navbar">
        <button
          className={currentScreen === "reporter" ? "active" : ""}
          onClick={() => setCurrentScreen("reporter")}
        >
          Reporter
        </button>
        <button
          className={currentScreen === "manager" ? "active" : ""}
          onClick={() => setCurrentScreen("manager")}
        >
          Manager
        </button>
        <button
          className={currentScreen === "technician" ? "active" : ""}
          onClick={() => setCurrentScreen("technician")}
        >
          Technician
        </button>
        <button
          className={currentScreen === "executive" ? "active" : ""}
          onClick={() => setCurrentScreen("executive")}
        >
          Executive
        </button>
      </div>

      {currentScreen === "reporter" && (
        <ReporterScreen reports={reports} onAddReport={addReport} />
      )}
      {currentScreen === "manager" && (
        <ManagerScreen workOrders={workOrders} onAddWorkOrder={addWorkOrder} onViewAsset={viewAssetDetail} />
      )}
      {currentScreen === "technician" && (
        <TechnicianScreen workOrders={workOrders} onCompleteWorkOrder={completeWorkOrder} />
      )}
      {currentScreen === "executive" && <ExecutiveScreen workOrders={workOrders} />}
      {currentScreen === "assetDetail" && (
        <AssetDetailScreen asset={selectedAsset} onBack={() => setCurrentScreen("manager")} />
      )}
    </div>
  )
}

export default App