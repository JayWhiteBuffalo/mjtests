import {AuthProvider} from '@components/auth/AuthProvider'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from 'next-themes'

export const Providers = ({children}) =>
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextThemesProvider>
  </NextUIProvider>
