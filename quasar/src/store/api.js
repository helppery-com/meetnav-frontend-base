import axios from 'axios'
const { v4: uuidv4 } = require('uuid')

class Api {
  jwt = null
  user = null
  baseUrl = process.env.API_ROOT
  sessionId = uuidv4()
  logsBuffer = []
  logsTimer = -1

  url (path) {
    if (this.baseUrl) {
      return this.baseUrl + path
    }
    return path
  }

  get mediaUrl () {
    return this.baseUrl
  }

  get uploadUrl () {
    return this.url('/upload')
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

  async registerGuest (email) {
    await axios.get(this.url('/accounts/registerGuest?email=' + email))
  }

  async createRoom (settings) {
    const headers = this.headers
    const res = await axios.post(this.url('/nekos'), settings, { headers })
    return res.data
  }

  async waitRoom (user, account, template, email) {
    const headers = this.headers
    const res = await axios.post(this.url('/nekos/wait'), { ...user, account, template, email }, { headers })
    return res.data
  }

  async joinRoom (roomId, template) {
    const headers = this.headers
    const res = await axios.put(this.url(`/nekos/${roomId}/join`), { template }, { headers })
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

  async log (logEntry) {
    this.logsBuffer.push(logEntry)
    clearTimeout(this.logsTimer)
    this.logsTimer = setTimeout(() => {
      const headers = this.headers
      const logs = this.logsBuffer
      this.logsBuffer = []
      axios.post(this.url('/logs'), { logs, source: 'client', session_id: this.sessionId }, { headers })
    }, 2000)
  }

  async nekotemplates () {
    const headers = this.headers
    const res = await axios.get(this.url('/nekotemplates'), { headers })
    return res.data
  }

  async chat (roomId, message) {
    const headers = this.headers
    const res = await axios.post(this.url(`/nekos/${roomId}/chat`), { message }, { headers })
    return res.data
  }
}
const api = new Api()
export default api
