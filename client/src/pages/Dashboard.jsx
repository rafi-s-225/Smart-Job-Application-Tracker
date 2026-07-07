import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    navigate("/")
  }

  return (
    <div>
      <h2>Welcome, {userName}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard