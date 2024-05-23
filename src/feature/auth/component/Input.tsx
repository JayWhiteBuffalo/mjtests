import {forwardRef, useState, useCallback} from 'react'
import {Icon} from '@iconify/react'
import {Input, type InputProps} from '@nextui-org/react'

export type PasswordInputProps = InputProps

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (rest, ref) => {
    const [showMask, setShowMask] = useState(true)
    const toggleShowMask = useCallback(() => setShowMask(x => !x), [])

    const maskButton = (
      <button type="button" onClick={toggleShowMask} tabIndex={-1}>
        {showMask ? (
          <Icon
            className="pointer-events-none text-2xl text-default-400"
            icon="solar:eye-bold"
          />
        ) : (
          <Icon
            className="pointer-events-none text-2xl text-default-400"
            icon="solar:eye-closed-linear"
          />
        )}
      </button>
    )

    return (
      <Input
        ref={ref}
        endContent={maskButton}
        type={showMask ? 'password' : 'text'}
        variant="bordered"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(rest as any)}
      />
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
