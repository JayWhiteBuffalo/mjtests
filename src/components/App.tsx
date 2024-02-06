'use client'

import './App.css'
import {FilterPaneContainer} from '@components/FilterPane'
import {ProductListPaneContainer} from '@components/ProductList'
//import {MapPaneContainer} from '@components/Map'
import dynamic from 'next/dynamic'
import {SearchBarContainer} from '@components/SearchBar'
import {LayoutStore} from '@state/UIStore'
import {FluxContainer} from '@state/Flux'
import {useRef, useCallback, useState} from 'react'

const AnimatedPane = ({open, className, children}) => {
  const animRef = useRef()
  const [lastOpen, setLastOpen] = useState(open)

  const onAnimationEnd = useCallback(event => {
    if (event.propertyName === 'transform') {
      setLastOpen(false)
    }
  }, [])

  return (
    <dialog
      ref={animRef}
      onTransitionEnd={lastOpen && !open ? onAnimationEnd : undefined}
      style={{zIndex: open !== lastOpen ? -1 : undefined}}
      open={open}
      className={`${className} AnimatedPane`}>
      {(open || open !== lastOpen) ? children : undefined}
    </dialog>
  )
}

const MapPaneContainer = dynamic(() => import('@components/Map').then(Map => Map.MapPaneContainer), {ssr: false})
const App = ({layout}) => {
  return (
    <main className={`App ${layout.pinMapPane ? 'pinMapPane' : ''}`}>
      <MapPaneContainer />
      <SearchBarContainer />
      <AnimatedPane className="FilterPaneWrapper" open={layout.showFilterPane}>
        <FilterPaneContainer />
      </AnimatedPane>
      <ProductListPaneContainer />
    </main>
  )
}

export const AppContainer = FluxContainer(
  [LayoutStore],
  (layout) => <App layout={layout} />
)
