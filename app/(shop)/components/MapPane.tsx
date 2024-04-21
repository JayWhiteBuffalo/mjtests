import clsx from 'clsx'
import dynamic from 'next/dynamic'
import {ErrorBoundary} from '@components/Error'
import {LayoutStore} from '../state/UIStore'
import {Spinner} from '@nextui-org/react'
import {useFluxStore} from '@/state/Flux'

const MapLoading = () =>
  <div className="w-full h-full flex flex-col items-center justify-center">
    <Spinner size="xl" />
  </div>

const MapContainer = dynamic(
  () => import('./Map').then(Map => Map.MapContainer),
  {
    ssr: false,
    loading: MapLoading,
  }
)

export const MapPaneContainer = () => {
  const layout = useFluxStore(LayoutStore)
  return (
    <div
      className={clsx(
        'relative flex-0 basis-[300px] border-b border-gray-300',
        layout.expandMapPane ? 'basis-[75vh]' : undefined,
      )}>
      <ErrorBoundary>
        <MapContainer />
      </ErrorBoundary>
    </div>
  )
}
