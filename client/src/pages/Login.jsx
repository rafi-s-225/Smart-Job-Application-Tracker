import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userName", response.data.user.name)

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    }
  }

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Login to your tracker</h1>
          <p className="subtext">Manage applications, track deadlines, and stay on top of every opportunity.</p>
        </div>

        {error && <div className="form-alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="primary-button" type="submit">Continue</button>
        </form>

        <p className="footer-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login