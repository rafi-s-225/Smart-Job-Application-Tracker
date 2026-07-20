import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

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
    }
  }

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Create your account</p>
          <h1>Register for the job tracker</h1>
          <p className="subtext">Secure your data and start tracking every job application in one place.</p>
        </div>

        {error && <div className="form-alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <button className="primary-button" type="submit">Create account</button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register