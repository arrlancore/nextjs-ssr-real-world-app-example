import React from 'react'
import Link from 'next/link'
import { useAuth } from '../libs/context'
import { handleLogout } from '../libs/userAuth'
import { withRouter } from 'next/router'
import { object } from 'prop-types'

const Header = ({ router }) => {
  const [authData, setAuth] = useAuth()
  const userIsLogin = authData ? authData.isLogin : false
  const activePath = (router && router.asPath) || '/'
  const username = router.query.username || authData.username

  const logout = () => {
    setAuth({})
    handleLogout()
  }

  const userProfile = {
    href: `/user-profile?username=${username}`,
    as: `/user-profile/${username}`
  }

  const menus = [
    {
      title: 'Home',
      href: '/',
      isLogin: null
    },
    {
      title: 'New Post',
      href: '/update-post',
      isLogin: true
    },
    {
      title: 'Setting',
      href: '/setting',
      isLogin: true
    },
    {
      title: 'Login',
      href: '/login',
      isLogin: false
    },
    {
      title: 'Sign Up',
      href: '/sign-up',
      isLogin: false
    },
    {
      title: username,
      href: userProfile.href,
      as: userProfile.as,
      isLogin: true
    }
  ]

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          {menus.map(({ title, isLogin, ...rest }, idx) => (
            <React.Fragment key={idx}>
              {isLogin === !!userIsLogin || isLogin === null ? (
                <li className="nav-item">
                  <Link {...rest}>
                    <a
                      style={{ textTransform: 'capitalize' }}
                      className={`nav-link ${activePath === rest.as || activePath === rest.href ? 'active' : ''}`}
                    >
                      {title}
                    </a>
                  </Link>
                </li>
              ) : (
                ''
              )}
            </React.Fragment>
          ))}

          {userIsLogin ? (
            <li onClick={logout} className="nav-item">
              <a style={{ cursor: 'pointer' }} className="nav-link">
                Logout
              </a>
            </li>
          ) : (
            ''
          )}
        </ul>
      </div>
    </nav>
  )
}
Header.propTypes = {
  router: object
}

export default withRouter(Header)
