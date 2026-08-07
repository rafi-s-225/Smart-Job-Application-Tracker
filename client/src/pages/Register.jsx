import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Briefcase, User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import api from "../api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userName", response.data.user.name)

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <Briefcase size={22} />
          </div>
          <span className="auth-brand-title">JobPilot AI</span>
        </div>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start tracking your applications and land your dream role.</p>
        </div>

        {error && (
          <div className="alert-banner error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (8+ chars)</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Free Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/">Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register