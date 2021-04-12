import axios from 'axios'

class Api {
  jwt = null

  url (path) {
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
    const res = await axios.post(this.url('/api/auth/local'), { identifier, password })
    return res.data
  }

  async register (username, email, password) {
    await axios.post(this.url('/api/auth/local/register'), { username, email, password })
  }

  async createRoom (roomId) {
    const headers = this.headers
    const res = await axios.post(this.url('/api/nekos'), { roomId }, { headers })
    return res.data
  }

  async joinRoom (roomId) {
    const headers = this.headers
    const res = await axios.put(this.url(`/api/nekos/${roomId}`), { }, { headers })
    return res.data
  }

  async closeRoom (roomId) {
    const headers = this.headers
    const res = await axios.delete(this.url(`/api/nekos/${roomId}`), { headers })
    return res.data
  }
}
const api = new Api()
export default api
