import axios from 'axios'

// Sanctum SPA auth: gunakan cookie httpOnly, BUKAN token di localStorage.
// Menyimpan token di localStorage rentan dicuri lewat XSS (OWASP A02/A07).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

export async function ensureCsrfCookie() {
  await api.get('/sanctum/csrf-cookie')
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default api
