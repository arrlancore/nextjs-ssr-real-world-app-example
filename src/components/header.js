import React from 'react'
import Link from 'next/link'
import { useAuth } from '../libs/context'
import { handleLogout } from '../libs/userAuth'
const Header = () => {
  const [authData, setAuth] = useAuth()
  const isLogin = authData ? authData.isLogin : false
  const { username } = authData || {}

  const logout = () => {
    setAuth({})
    handleLogout()
  }

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link active">Home</a>
            </Link>
          </li>
          {isLogin ? (
            <>
              <li className="nav-item">
                <Link href="/update-post">
                  <a className="nav-link">
                    <i className="ion-compose" />
                    &nbsp;New Post
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/setting">
                  <a className="nav-link">
                    <i className="ion-gear-a" />
                    &nbsp;Settings
                  </a>
                </Link>
              </li>
            </>
          ) : (
            ''
          )}
          {!isLogin ? (
            <>
              <li className="nav-item">
                <Link href="/login">
                  <a className="nav-link">Login</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/sign-up">
                  <a className="nav-link">Sign up</a>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link href={`/user-profile?username=${username}`} as={`/user-profile/${username}`}>
                  <a style={{ textTransform: 'capitalize' }} className="nav-link">
                    {username}
                  </a>
                </Link>
              </li>
              <li onClick={logout} className="nav-item">
                <a style={{ cursor: 'pointer' }} className="nav-link">
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Header
