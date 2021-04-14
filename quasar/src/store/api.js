import axios from 'axios'

class Api {
  jwt = null
  user = null
  baseUrl = process.env.API_ROOT

  url (path) {
    if (this.baseUrl) {
      return this.baseUrl + path
    }
    return path
  }

  get headers () {
    const headers = {
    }
    if (this.jwt) {
      headers.Authorization = `Bearer ${this.jwt}`
    }
    return headers
  }

  async login (identifier, password) {
    const res = await axios.post(this.url('/auth/local'), { identifier, password })
    return res.data
  }

  async register (username, email, password) {
    await axios.post(this.url('/auth/local/register'), { username, email, password })
  }

  async createRoom (template) {
    const headers = this.headers
    const res = await axios.post(this.url('/nekos'), { template }, { headers })
    return res.data
  }

  async joinRoom (roomId) {
    const headers = this.headers
    const res = await axios.put(this.url(`/nekos/${roomId}`), { }, { headers })
    return res.data
  }

  async closeRoom (roomId) {
    const headers = this.headers
    const res = await axios.delete(this.url(`/nekos/${roomId}`), { headers })
    return res.data
  }

  async changeLanguage (lang) {
    const headers = this.headers
    const res = await axios.put(this.url('/users/' + this.user.id), { lang }, { headers })
    return res.data
  }
}
const api = new Api()
export default api
