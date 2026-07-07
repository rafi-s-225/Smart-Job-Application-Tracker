import { Link } from "react-router-dom"

function Login() {
  return (
    <div>
      <h2>Login Page</h2>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}

export default Login