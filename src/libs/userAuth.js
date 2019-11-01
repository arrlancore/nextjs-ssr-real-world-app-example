import Cookies from 'js-cookie'
import Router from 'next/router'
const projectName = 'next_ssr_real_world_app'
const cookiesUserToken = '_user_token'

/**
 * save user data to local storage and cookies
 * @param {object} data
 */
export const saveUser = data => {
  localStorage.setItem(`${projectName}_user`, JSON.stringify(data))
  Cookies.set(cookiesUserToken, data.token)
}

export const handleLogout = (res, redirectToLogin = true) => {
  localStorage.removeItem(`${projectName}_user`)
  Cookies.remove(cookiesUserToken)
  if (redirectToLogin) {
    process.browser ? Router.push('/login') : res && res.writeHead(301, { Location: '/login' })
  }
}

export const getUser = () => {
  const data = process.browser ? localStorage.getItem(`${projectName}_user`) : null
  return JSON.parse(data)
}

export const getToken = () => {
  const data = getUser()
  return data ? data.token : ''
}

export const isMine = username => {
  const data = getUser()
  return data && data.username === username
}

export const getTokenFromCookie = cookies => {
  let token = null
  if (typeof cookies === 'string' && cookies.length > 1) {
    const datatoken = cookies.split(';').filter(data => data.search('user_token') !== -1) || ['']
    const tokens = datatoken[0] ? datatoken[0].split('=') : datatoken
    token = tokens.length === 2 && tokens[1]
  }
  return token
}

export const protectPage = (req, res) => {
  const cookies = (req && req.headers && req.headers.cookie) || ''
  const token = getTokenFromCookie(cookies)
  if (!token) {
    res.writeHead(301, { Location: '/login' })
    res.end()
  }
}
