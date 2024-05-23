import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary'

export const Fallback = ({error}) => (
  <div role="alert" className="border-danger border-1 radius-md p-2">
    <p>Error during render</p>
    <pre className="text-red-600">{error.message}</pre>
  </div>
)

export const ErrorBoundary = ({children, ...rest}) => (
  <ReactErrorBoundary FallbackComponent={Fallback} {...rest}>
    {children}
  </ReactErrorBoundary>
)
