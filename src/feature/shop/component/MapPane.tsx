import clsx from 'clsx'
import dynamic from 'next/dynamic'
import {ErrorBoundary} from '@/feature/shared/component/Error'
import {LayoutStore} from '@feature/shop/state/UIStore'
import {Spinner} from '@nextui-org/react'
import {useFluxStore} from '@/state/Flux'
import './Map.css'

const MapLoading = () => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <Spinner size="xl" />
  </div>
)

const MapContainer = dynamic(
  () => import('./Map').then(Map => Map.MapContainer),
  {
    ssr: false,
    loading: MapLoading,
  },
)

export const MapPaneContainer = () => {
  const layout = useFluxStore(LayoutStore)
  return (
    
    <div
      className={clsx(
        'mt-12 relative flex-0 basis-[500px] shadow-xl max-w-3xl left-24 mapPaneCont',
        layout.expandMapPane ? 'basis-[75vh]' : undefined,
      )}
    >
      <ErrorBoundary>
        <MapContainer />
      </ErrorBoundary>
    </div>
  )
}
