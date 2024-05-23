import clsx from 'clsx'
import Link from 'next/link'
import {forwardRef} from 'react'
import {HiExternalLink} from 'react-icons/hi'

// Internal link behavior, inline link style
export const BlueLink = forwardRef(({children, className, ...rest}, ref) => (
  <Link
    className={clsx(
      'text-cyan-600 hover:underline dark:text-cyan-500',
      className,
    )}
    ref={ref}
    {...rest}
  >
    {children}
  </Link>
))
BlueLink.displayName = 'BlueLink'

// Button behavior, inline link style
export const BlueButton = forwardRef(({children, className, ...rest}, ref) => (
  <button
    className={clsx(
      'text-cyan-600 hover:underline dark:text-cyan-500',
      className,
    )}
    ref={ref}
    type="button"
    {...rest}
  >
    {children}
  </button>
))
BlueButton.displayName = 'BlueButton'

// External link behavior, inline link style
export const BlueExternalLink = forwardRef(
  ({children, className, newTab = true, ...rest}, ref) => (
    <a
      className={clsx(
        'text-cyan-600 hover:underline dark:text-cyan-500',
        className,
      )}
      ref={ref}
      rel={newTab ? 'noreferrer' : undefined}
      target={newTab ? '_blank' : undefined}
      {...rest}
    >
      {children}
      {newTab ? (
        <HiExternalLink
          className="inline-block w-4 h-4"
          style={{marginTop: -2}}
        />
      ) : undefined}
    </a>
  ),
)
BlueExternalLink.displayName = 'BlueExternalLink'
