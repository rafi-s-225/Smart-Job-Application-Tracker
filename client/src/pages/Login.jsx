import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Briefcase, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import api from "../api"

function Login() {
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
      const response = await api.post("/auth/login", {
        email,
        password
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userName", response.data.user.name)

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please verify your credentials.")
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
          <h1>Welcome Back</h1>
          <p>Track your job search pipeline with ease and clarity.</p>
        </div>

        {error && (
          <div className="alert-banner error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login