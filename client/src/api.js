import axios from "axios"

let rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
rawUrl = rawUrl.trim().replace(/\/+$/, "")
if (!rawUrl.endsWith("/api")) {
  rawUrl = `${rawUrl}/api`
}

const api = axios.create({
  baseURL: rawUrl
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("userName")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export default api