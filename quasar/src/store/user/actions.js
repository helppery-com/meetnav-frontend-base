export const login = async (context, { username, password }) => {
  const user = { username: 'admin', password: 'admin' }
  try {
    if (username !== user.username) {
      throw new Error('Username not match')
    }
    if (password !== user.password) {
      throw new Error('Password not match')
    }
    return { ok: true, message: 'login successfull', user: { username: 'username', avatar: 'https://eu.ui-avatars.com/api/?name=username' } }
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
