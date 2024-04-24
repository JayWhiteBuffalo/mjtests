import {forwardRef, useState, useCallback} from 'react'
import {Icon} from '@iconify/react'
import {Input} from '@nextui-org/react'

export const PasswordInput = forwardRef((rest, ref) => {
  const [showMask, setShowMask] = useState(true)
  const toggleShowMask = useCallback(() => setShowMask(x => !x), [])

  const maskButton =
    <button type="button" onClick={toggleShowMask} tabIndex={-1}>
      {
        showMask
          ? <Icon
              className="pointer-events-none text-2xl text-default-400"
              icon="solar:eye-bold"
            />
          : <Icon
              className="pointer-events-none text-2xl text-default-400"
              icon="solar:eye-closed-linear"
            />
      }
    </button>

  return (
    <Input
      ref={ref}
      endContent={maskButton}
      type={showMask ? 'password': 'text'}
      variant="bordered"
      {...rest}
    />
  )
})
PasswordInput.displayName = 'PasswordInput'
