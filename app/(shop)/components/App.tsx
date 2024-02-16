'use client'

//import {MapPaneContainer} from '@components/Map'
import './App.css'
import dynamic from 'next/dynamic'
import {dispatch} from '../state/Action'
import {FilteredProductStore} from '../state/DataStore'
import {FilterPaneContainer} from './FilterPane'
import {LayoutStore} from '../state/UIStore'
import {Present} from '@util/Present'
import {ProductListPaneContainer} from './ProductList'
import {SearchBarContainer} from './SearchBar'
import {useFluxStore} from '@/state/Flux'
import {usePathname} from 'next/navigation'
import {useRef, useCallback, useState, useEffect} from 'react'
import {ShopFooter} from './Footer'

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
      className={`${className} AnimatedPane`}>
      {(open || open !== lastOpen) ? children : undefined}
    </dialog>
  )
}

const MapPaneContainer = dynamic(() => import('./Map').then(Map => Map.MapPaneContainer), {ssr: false})
const App = ({layout}) =>

  <main className={`App ${layout.pinMapPane ? 'pinMapPane' : ''}`}>
    {layout.showMapPane ? <MapPaneContainer /> : undefined}
    <SearchBarContainer />
    <AnimatedPane className="FilterPaneWrapper" open={layout.showFilterPane}>
      <FilterPaneContainer />
    </AnimatedPane>
    <ProductListPaneContainer />
    <ShopFooter />
  </main>

export const AppContainer = ({initial}) => {
  const [first, setFirst] = useState(true)
  const pathname = usePathname()
  if (first) {
    dispatch({type: 'route.initialize', pathname, query: initial.query})
    FilteredProductStore.set({filter: initial.filter, products: Present.resolve(initial.products)})
    setFirst(false)
  }

  const onPopState = useCallback(event => {
    console.log('popstate', event.state)
    if (event.state) {
      //dispatch({type: 'route.set', pathname, query: ObjectUtil.fromEntries(searchParams)})
    }
  }, [])
  useEffect(() => {
    window.addEventListener('popstate', onPopState)
    return window.removeEventListener('popstate', onPopState)
  }, [onPopState])

  const layout = useFluxStore(LayoutStore)
  return <App layout={layout} />
}
