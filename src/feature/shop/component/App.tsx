'use client'
import './App.css'
import clsx from 'clsx'
import {Actions} from '@feature/shop/state/Action'
import {dispatcher, dispatch} from '@/state/Flux'
import {FilteredProductStore} from '@feature/shop/state/DataStore'
import {FilterPaneContainer} from './FilterPane'
import {LayoutStore} from '@feature/shop/state/UIStore'
import {MapPaneContainer} from './MapPane'
import {Present} from '@util/Present'
import {ProductListPaneContainer} from './ProductList'
import {SearchBarContainer} from './SearchBar'
import {ShopFooter} from './Footer'
import {useFluxStore} from '@/state/Flux'
import {usePathname} from 'next/navigation'
import {Header} from '@/feature/shop/component/Nav/Header'
import {useRef, useCallback, useState, useEffect} from 'react'
import ProductDto from '@/data/ProductDto'
import {VendorListPaneContainer} from '@/feature/shop/component/VendorList'
import {ProducerListPaneContainer} from '@/feature/shop/component/ProducerList'
import useViewport from '@/feature/shop/state/ViewPort'

const AnimatedPane = ({open, className, children}) => {
  const animRef = useRef()
  const [lastOpen, setLastOpen] = useState(open)


  const onTransitionEnd = useCallback(
    event => {
      if (event.propertyName === 'transform') {
        setLastOpen(open)
      }
    },
    [open],
  )

  return (
    <dialog
      ref={animRef}
      onTransitionEnd={onTransitionEnd}
      style={{zIndex: open !== lastOpen ? -1 : undefined}}
      open={open}
      className={clsx('AnimatedPane w-auto', className)}
    >
      {open || open !== lastOpen ? children : undefined}
    </dialog>
  )
}

const FilterPaneWrapper = ({layout}) => (
  <AnimatedPane
    className={clsx(
      'FilterPaneWrapper flex-1',
      'flex flex-col relative transition-all items-center',
    )}
    open={layout.showFilterPane}
  >
    <FilterPaneContainer />
  </AnimatedPane>
)

const App = ({ user, layout}) => {

  const [toggle, setToggle] = useState("default")
  const {viewport} = useViewport();
  const updatePane = (value) => {
    console.log("updatePane called with value:", value); // Debugging log
    setToggle(value);
  };

  return(
  <main
    className={clsx(
      'App',
      'flex flex-col items-stretch',
      layout.pinMapPane ? 'pinMapPane overflow-hidden h-screen' : undefined,
    )}
  >
    
    {layout.showMapPane ? <MapPaneContainer /> : undefined}
    <SearchBarContainer updatePane={updatePane} toggle={toggle} />
    <section className='w-full h-full flex p-10'>
      <div className={clsx(
        'h-full relative flex justify-center items-center ',
        {
      'w-1/3 ' : viewport === 'largeDesktop' ,
      'w-full' : viewport === 'mobile' 
        }
    )}
      >
        <FilterPaneWrapper layout={layout} />
      </div>
      {toggle === "default" && !layout.showFilterPane && viewport === 'mobile' &&
        <ProductListPaneContainer />
      }
      {
        toggle === "default" && viewport === 'desktop'  &&
        <ProductListPaneContainer />
      }
      {
        toggle === "default" && viewport === 'largeDesktop'  &&
        <ProductListPaneContainer />
      }
      
    {toggle === "vendors" &&
      <VendorListPaneContainer />
    }
    </section>
  </main>
)
}

export const AppContainer = ({user, initial}) => {

  const pathname = usePathname()

  useEffect(() => dispatcher.registerActions(Actions), [])

  useEffect(() => {

  //   if(producerToggle === true){
  //     dispatch({type: 'route.initialize', pathname, query: initial.query})
  //     FilteredProductStore.set({
  //       filter: initial.filter,
  //       products: Present.resolve(initial.producerProducts),
  //     })
      
  //   }
  //   if(producerToggle === false){
    
    dispatch({type: 'route.initialize', pathname, query: initial.query})
    FilteredProductStore.set({
      filter: initial.filter,
      products: Present.resolve(initial.products),
    })
  
  }, [initial, pathname])
  


  const onPopState = useCallback(event => {
    if (event.state) {
      //dispatch({type: 'route.set', pathname, query: Object.fromEntries(searchParams)})
    }
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', onPopState)
    return window.removeEventListener('popstate', onPopState)
  }, [onPopState])

  const layout = useFluxStore(LayoutStore)
  return <App user={user} layout={layout} />
}
