import {AuthProvider} from '@components/auth/AuthProvider'
import {MantineProvider} from '@mantine/core'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from 'next-themes'

export const Providers = ({children}) =>
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="light">
      <MantineProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MantineProvider>
    </NextThemesProvider>
  </NextUIProvider>
