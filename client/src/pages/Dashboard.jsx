import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

function Dashboard() {
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName")

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [companyName, setCompanyName] = useState("")
  const [jobRole, setJobRole] = useState("")
  const [applicationDate, setApplicationDate] = useState("")
  const [status, setStatus] = useState("Applied")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")

  const fetchApplications = async () => {
    try {
      const response = await api.get("/jobs")
      setApplications(response.data)
      setLoading(false)
    } catch (err) {
      setError("Could not load job applications")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleAddApplication = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await api.post("/jobs", {
        companyName: companyName,
        jobRole: jobRole,
        applicationDate: applicationDate,
        status: status,
        deadline: deadline,
        notes: notes
      })

      setCompanyName("")
      setJobRole("")
      setApplicationDate("")
      setStatus("Applied")
      setDeadline("")
      setNotes("")

      fetchApplications()
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message)
      } else {
        setError("Cannot connect to server")
      }
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put("/jobs/" + id, { status: newStatus })
      fetchApplications()
    } catch (err) {
      setError("Could not update status")
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete("/jobs/" + id)
      fetchApplications()
    } catch (err) {
      setError("Could not delete application")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    navigate("/")
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {userName}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="add-application-section">
        <h3>Add New Application</h3>
        <form onSubmit={handleAddApplication}>
          <div>
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Job Role</label>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Application Date</label>
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div>
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit">Add Application</button>
        </form>
      </div>

      <div className="applications-list">
        <h3>Your Applications</h3>

        {loading && <p>Loading...</p>}

        {!loading && applications.length === 0 && (
          <p>No job applications yet. Add your first one above.</p>
        )}

        {applications.map((app) => (
          <div className="application-card" key={app._id}>
            <h4>{app.companyName}</h4>
            <p>Role: {app.jobRole}</p>
            <p>Applied on: {app.applicationDate ? app.applicationDate.substring(0, 10) : ""}</p>
            {app.deadline && <p>Deadline: {app.deadline.substring(0, 10)}</p>}
            {app.notes && <p>Notes: {app.notes}</p>}

            <label>Status</label>
            <select
              value={app.status}
              onChange={(e) => handleStatusChange(app._id, e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button onClick={() => handleDelete(app._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard