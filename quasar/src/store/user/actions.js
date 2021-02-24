import { getUser, getFriends } from '../dummy'

export const login = async (context, { username, password }) => {
  const user = { id: 1, username: 'admin', password: 'admin' }
  try {
    if (username !== user.username) {
      throw new Error('Username not match')
    }
    if (password !== user.password) {
      throw new Error('Password not match')
    }
    return { ok: true, message: 'login successfull', user: getUser(user.id) }
  } catch (error) {
    return { ok: false, message: error.message }
  }
}
export const registration = async (context, { username, password, rePassword }) => {
  try {
    if (password !== rePassword) {
      throw new Error('Password not match')
    }
    return { ok: true, message: 'Please check your email to confirm your account' }
  } catch (error) {
    return { ok: false, message: error.message }
  }
}

export const getFriend = async (context) => {
  const user = context.state.user
  if (user) {
    context.commit('SET_FRIENDS', getFriends(user.id))
  }
}
