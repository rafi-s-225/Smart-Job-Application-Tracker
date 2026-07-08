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
        email: email,
        password: password
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("userName", response.data.user.name)

      navigate("/dashboard")
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <div ckassName = "auth-container">
      <h2>Login</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}

export default Login