import { createContext, useState, useContext } from 'react'
import { getUser, getTokenFromCookie } from './userAuth'
import React from 'react'
import { object, string } from 'prop-types'

const jwt = require('jsonwebtoken')
// create auth context
export const AuthContext = createContext()
// create provider for wrap component that will use context
export const AuthProvider = ({ children, cookies }) => {
  const token = getTokenFromCookie(cookies)
  const dataToken = token ? jwt.decode(token) : {} // extract data from token
  const [dataAuth, setDataAuth] = useState(getUser() || { token, isLogin: !!token, ...dataToken })
  return <AuthContext.Provider value={[dataAuth, setDataAuth]}>{children}</AuthContext.Provider>
}
AuthProvider.propTypes = { children: object, cookies: string }
// create an hook to easily use authContext
export const useAuth = () => useContext(AuthContext)
