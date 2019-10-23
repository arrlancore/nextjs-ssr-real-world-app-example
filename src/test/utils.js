import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import {AuthProvider} from '../libs/context'
import {theme} from '../config'

const WithProviders = ({ children }) => (
<ThemeProvider theme={theme}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </ThemeProvider>
  )

const customRender = (ui, options) => render(ui, { wrapper: WithProviders, ...options })
export * from '@testing-library/react'
export { customRender as render }
