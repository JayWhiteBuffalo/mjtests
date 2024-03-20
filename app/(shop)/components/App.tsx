'use client'
import './App.css'
import clsx from 'clsx'
import {Actions} from '@app/(shop)/state/Action'
import {dispatcher, dispatch} from '@/state/Flux'
import {FilteredProductStore} from '../state/DataStore'
import {FilterPaneContainer} from './FilterPane'
import {LayoutStore} from '../state/UIStore'
import {MapPaneContainer} from './MapPane'
import {Present} from '@util/Present'
import {ProductListPaneContainer} from './ProductList'
import {SearchBarContainer} from './SearchBar'
import {ShopFooter} from './Footer'
import {useFluxStore} from '@/state/Flux'
import {usePathname} from 'next/navigation'
import {useRef, useCallback, useState, useEffect} from 'react'

const AnimatedPane = ({open, className, children}) => {
  const animRef = useRef()
  const [lastOpen, setLastOpen] = useState(open)

  const onTransitionEnd = useCallback(event => {
    if (event.propertyName === 'transform') {
      setLastOpen(open)
    }
  }, [open])

  return (
    <dialog
      ref={animRef}
      onTransitionEnd={onTransitionEnd}
      style={{zIndex: open !== lastOpen ? -1 : undefined}}
      open={open}
      className={clsx('AnimatedPane w-auto', className)}>
      {(open || open !== lastOpen) ? children : undefined}
    </dialog>
  )
}

const FilterPaneWrapper = ({layout}) =>
  <AnimatedPane
    className={clsx(
      'FilterPaneWrapper flex-1',
      'flex flex-col relative transition-all items-center',
    )}
    open={layout.showFilterPane}>
    <FilterPaneContainer />
  </AnimatedPane>

const App = ({layout}) =>
  <main
    className={clsx(
      'App',
      'flex flex-col items-stretch',
      layout.pinMapPane ? 'pinMapPane overflow-hidden h-screen' : undefined,
    )}>
    {layout.showMapPane ? <MapPaneContainer /> : undefined}
    <SearchBarContainer />
    <FilterPaneWrapper layout={layout} />
    <ProductListPaneContainer />
    <ShopFooter />
  </main>

export const AppContainer = ({initial}) => {
  const pathname = usePathname()

  useEffect(() => dispatcher.registerActions(Actions), [])

  useEffect(() => {
    dispatch({type: 'route.initialize', pathname, query: initial.query})
    FilteredProductStore.set({filter: initial.filter, products: Present.resolve(initial.products)})
  }, [initial, pathname])

  const onPopState = useCallback(event => {
    console.log('popstate', event.state)
    if (event.state) {
      //dispatch({type: 'route.set', pathname, query: Object.fromEntries(searchParams)})
    }
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', onPopState)
    return window.removeEventListener('popstate', onPopState)
  }, [onPopState])

  const layout = useFluxStore(LayoutStore)
  return <App layout={layout} />
}
