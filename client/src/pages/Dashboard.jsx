import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  LogOut,
  Moon,
  Sun,
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  X,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import api from "../api"
import AIChatAssistant from "../components/AIChatAssistant"

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"]

function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Job Seeker")

  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [toastMessage, setToastMessage] = useState("")

  const [viewMode, setViewMode] = useState("board") // "board" | "list"
  const [theme, setTheme] = useState("dark")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("newest") // "newest" | "oldest" | "company" | "deadline"

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState(null) // App object when editing

  // Form State
  const initialFormData = {
    companyName: "",
    jobRole: "",
    applicationDate: new Date().toISOString().substring(0, 10),
    status: "Applied",
    deadline: "",
    salary: "",
    location: "",
    jobUrl: "",
    contactName: "",
    contactEmail: "",
    notes: "",
    favorite: false
  }

  const [formData, setFormData] = useState(initialFormData)

  // Fetch applications and statistics
  const fetchData = async () => {
    try {
      setLoading(true)
      const [appsRes, statsRes, userRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/jobs/stats").catch(() => null),
        api.get("/auth/me").catch(() => null)
      ])

      setApplications(appsRes.data)
      if (statsRes?.data) setStats(statsRes.data)
      if (userRes?.data?.name) {
        setUserName(userRes.data.name)
        localStorage.setItem("userName", userRes.data.name)
      }
      setError("")
    } catch {
      setError("Could not retrieve application data. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    document.documentElement.setAttribute("data-theme", nextTheme)
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  // Handle Form Submission (Create or Edit)
  const handleSaveApplication = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (editingApp) {
        await api.put(`/jobs/${editingApp._id}`, formData)
        showToast("Application updated successfully!")
      } else {
        await api.post("/jobs", formData)
        showToast("New job application tracked!")
      }

      setIsAddModalOpen(false)
      setEditingApp(null)
      setFormData(initialFormData)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save application")
    }
  }

  const openEditModal = (app) => {
    setEditingApp(app)
    setFormData({
      companyName: app.companyName || "",
      jobRole: app.jobRole || "",
      applicationDate: app.applicationDate ? app.applicationDate.substring(0, 10) : "",
      status: app.status || "Applied",
      deadline: app.deadline ? app.deadline.substring(0, 10) : "",
      salary: app.salary || "",
      location: app.location || "",
      jobUrl: app.jobUrl || "",
      contactName: app.contactName || "",
      contactEmail: app.contactEmail || "",
      notes: app.notes || "",
      favorite: Boolean(app.favorite)
    })
    setIsAddModalOpen(true)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/jobs/${id}`, { status: newStatus })
      showToast(`Status updated to ${newStatus}`)
      fetchData()
    } catch {
      setError("Could not update application status")
    }
  }

  const handleToggleFavorite = async (app) => {
    try {
      await api.put(`/jobs/${app._id}`, { favorite: !app.favorite })
      fetchData()
    } catch {
      setError("Could not update favorite state")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return

    try {
      await api.delete(`/jobs/${id}`)
      showToast("Application deleted")
      fetchData()
    } catch {
      setError("Could not delete application")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    navigate("/")
  }

  // Filter & Sort Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === "ALL" || app.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (a.favorite !== b.favorite) return b.favorite ? 1 : -1

        if (sortBy === "newest") return new Date(b.createdAt || b.applicationDate) - new Date(a.createdAt || a.applicationDate)
        if (sortBy === "oldest") return new Date(a.createdAt || a.applicationDate) - new Date(b.createdAt || b.applicationDate)
        if (sortBy === "company") return a.companyName.localeCompare(b.companyName)
        if (sortBy === "deadline") {
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline) - new Date(b.deadline)
        }
        return 0
      })
  }, [applications, searchQuery, statusFilter, sortBy])

  // Computed summary metric calculations
  const totalCount = applications.length
  const interviewCount = applications.filter((a) => a.status === "Interview").length
  const offerCount = applications.filter((a) => a.status === "Offer").length
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-logo">
              <Briefcase size={20} />
            </div>
            <span className="navbar-title">JobPilot AI</span>
          </div>

          <div className="navbar-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="user-badge">
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userName}</span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* DASHBOARD BODY */}
      <main className="dashboard-main">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="alert-banner success" style={{ marginBottom: 0 }}>
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert-banner error" style={{ marginBottom: 0 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* METRICS OVERVIEW */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-info">
              <h4>Total Applications</h4>
              <div className="metric-number">{totalCount}</div>
              <div className="metric-sub">Tracked opportunities</div>
            </div>
            <div className="metric-icon-box total">
              <Briefcase size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Interviews</h4>
              <div className="metric-number">{interviewCount}</div>
              <div className="metric-sub">Active discussions</div>
            </div>
            <div className="metric-icon-box interview">
              <Clock size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Offers</h4>
              <div className="metric-number">{offerCount}</div>
              <div className="metric-sub">Success outcomes</div>
            </div>
            <div className="metric-icon-box offer">
              <Award size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Response Rate</h4>
              <div className="metric-number">
                {stats?.responseRate !== undefined
                  ? `${stats.responseRate}%`
                  : totalCount > 0
                  ? `${Math.round(((interviewCount + offerCount + rejectedCount) / totalCount) * 100)}%`
                  : "0%"}
              </div>
              <div className="metric-sub">Employers responded</div>
            </div>
            <div className="metric-icon-box total">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <h4>Upcoming Deadlines</h4>
              <div className="metric-number">{stats?.upcomingDeadlinesCount || 0}</div>
              <div className="metric-sub">Next 7 days</div>
            </div>
            <div className="metric-icon-box deadline">
              <Calendar size={22} />
            </div>
          </div>
        </section>

        {/* CONTROLS BAR */}
        <section className="controls-bar">
          <div className="search-filter-group">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by company, role, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="company">Sort by: Company Name</option>
              <option value="deadline">Sort by: Deadline</option>
            </select>
          </div>

          <div className="view-actions">
            <div className="view-toggle-btns">
              <button
                className={`toggle-btn ${viewMode === "board" ? "active" : ""}`}
                onClick={() => setViewMode("board")}
              >
                <LayoutGrid size={16} />
                <span>Board</span>
              </button>
              <button
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <ListIcon size={16} />
                <span>List</span>
              </button>
            </div>

            <button
              className="add-app-btn"
              onClick={() => {
                setEditingApp(null)
                setFormData(initialFormData)
                setIsAddModalOpen(true)
              }}
            >
              <Plus size={18} />
              <span>Add Application</span>
            </button>
          </div>
        </section>

        {/* MAIN VIEW CONTENT */}
        {loading ? (
          <div className="loading-spinner">
            <p>Loading application pipeline...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Briefcase size={32} />
            </div>
            <h3>No Job Applications Found</h3>
            <p>
              {searchQuery || statusFilter !== "ALL"
                ? "No applications matched your search or status filter criteria."
                : "You haven't tracked any job applications yet. Click 'Add Application' to get started."}
            </p>
            <button
              className="add-app-btn"
              style={{ marginTop: 8 }}
              onClick={() => {
                setEditingApp(null)
                setFormData(initialFormData)
                setIsAddModalOpen(true)
              }}
            >
              <Plus size={18} />
              <span>Track Your First Job</span>
            </button>
          </div>
        ) : viewMode === "board" ? (
          /* KANBAN BOARD VIEW */
          <div className="kanban-board">
            {STATUSES.map((statusName) => {
              const columnApps = filteredApplications.filter((app) => app.status === statusName)

              return (
                <div key={statusName} className="kanban-column">
                  <div className="column-header">
                    <div className="column-title">
                      <span className={`status-badge status-${statusName}`}>
                        <span className="status-dot"></span>
                        {statusName}
                      </span>
                    </div>
                    <span className="column-count">{columnApps.length}</span>
                  </div>

                  <div className="kanban-cards-list">
                    {columnApps.map((app) => (
                      <div key={app._id} className="job-card">
                        <div className="job-card-top">
                          <div>
                            <div className="job-card-title">{app.jobRole}</div>
                            <div className="job-card-company">{app.companyName}</div>
                          </div>
                          <button
                            className={`fav-btn ${app.favorite ? "active" : ""}`}
                            onClick={() => handleToggleFavorite(app)}
                            title={app.favorite ? "Unpin" : "Pin application"}
                          >
                            <Star size={16} fill={app.favorite ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <div className="job-card-meta">
                          {app.location && (
                            <span className="meta-item">
                              <MapPin size={12} /> {app.location}
                            </span>
                          )}
                          {app.salary && (
                            <span className="meta-item">
                              <DollarSign size={12} /> {app.salary}
                            </span>
                          )}
                          {app.applicationDate && (
                            <span className="meta-item">
                              <Calendar size={12} /> Applied: {app.applicationDate.substring(0, 10)}
                            </span>
                          )}
                          {app.deadline && (
                            <span className="meta-item" style={{ color: "var(--accent-amber)" }}>
                              <Clock size={12} /> Due: {app.deadline.substring(0, 10)}
                            </span>
                          )}
                        </div>

                        {app.notes && <div className="job-card-notes">{app.notes}</div>}

                        <div className="job-card-actions">
                          <select
                            className="filter-select"
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <div className="card-action-btns">
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl.startsWith("http") ? app.jobUrl : `https://${app.jobUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="icon-action-btn"
                                title="Open Job Listing"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              className="icon-action-btn"
                              onClick={() => openEditModal(app)}
                              title="Edit Application"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="icon-action-btn delete"
                              onClick={() => handleDelete(app._id)}
                              title="Delete Application"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* LIST TABLE VIEW */
          <div className="list-view-container">
            <table className="apps-table">
              <thead>
                <tr>
                  <th>Company & Role</th>
                  <th>Status</th>
                  <th>Location & Salary</th>
                  <th>Applied On</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          className={`fav-btn ${app.favorite ? "active" : ""}`}
                          onClick={() => handleToggleFavorite(app)}
                        >
                          <Star size={14} fill={app.favorite ? "currentColor" : "none"} />
                        </button>
                        <div>
                          <div className="table-company">{app.companyName}</div>
                          <div className="table-role">{app.jobRole}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        className="filter-select"
                        style={{ padding: "4px 8px", fontSize: "13px" }}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ fontSize: "13px" }}>
                        {app.location || "—"}
                        {app.salary && <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>{app.salary}</div>}
                      </div>
                    </td>
                    <td>{app.applicationDate ? app.applicationDate.substring(0, 10) : "—"}</td>
                    <td>
                      {app.deadline ? (
                        <span style={{ color: "var(--accent-amber)", fontWeight: 600 }}>
                          {app.deadline.substring(0, 10)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="card-action-btns">
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl.startsWith("http") ? app.jobUrl : `https://${app.jobUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="icon-action-btn"
                            title="Job URL"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          className="icon-action-btn"
                          onClick={() => openEditModal(app)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="icon-action-btn delete"
                          onClick={() => handleDelete(app._id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* CREATE / EDIT APPLICATION MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingApp ? "Edit Application" : "Track New Application"}</h3>
              <button
                className="close-modal-btn"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingApp(null)
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveApplication}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Google, Stripe"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Role *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.jobRole}
                      onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Application Status</label>
                    <select
                      className="form-input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Application Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.applicationDate}
                      onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Remote / New York"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Salary / Pay</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. $140,000 / yr"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Job URL Link</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://company.com/careers/job"
                      value={formData.jobUrl}
                      onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Deadline Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Recruiter / Contact Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sarah Connor"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Recruiter Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="sarah@company.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes / Prep Log</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Interview dates, referral details, tech stack notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    id="fav-check"
                    checked={formData.favorite}
                    onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                    style={{ width: "auto", cursor: "pointer" }}
                  />
                  <label htmlFor="fav-check" style={{ cursor: "pointer" }}>
                    Pin to top of list (Favorite)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setEditingApp(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingApp ? "Update Application" : "Save Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Floating Widget */}
      <AIChatAssistant />
    </div>
  )
}

export default Dashboard