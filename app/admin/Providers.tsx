import {customTheme} from './Theme'
import {Flowbite} from 'flowbite-react'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from 'next-themes'
import {MantineProvider} from '@mantine/core'

export const Providers = ({children}) =>
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="light">
      <MantineProvider>
        <Flowbite theme={{theme: customTheme}}>
          {children}
        </Flowbite>
      </MantineProvider>
    </NextThemesProvider>
  </NextUIProvider>
