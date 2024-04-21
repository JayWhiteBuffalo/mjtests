import {customTheme} from './Theme'
import {Flowbite} from 'flowbite-react'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from 'next-themes'

export const Providers = ({children}) =>
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <Flowbite theme={{theme: customTheme}}>
        {children}
      </Flowbite>
    </NextThemesProvider>
  </NextUIProvider>
