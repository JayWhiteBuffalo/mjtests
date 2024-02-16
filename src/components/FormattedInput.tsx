import clsx from 'clsx'
import {forwardRef, useEffect, useState, useCallback} from 'react'
import {TextInput} from 'flowbite-react'

export const FormattedInput = forwardRef(({value, defaultValue, format, parse, onChange, className, ...rest}, ref) => {
  const [text, setText] = useState(format(defaultValue ?? value))

  useEffect(() => setText(format(value)), [value, format])

  const validate = useCallback(newText => {
    const newValue = parse(newText)
    if (newValue !== value) {
      onChange(newValue)
    }
    setText(format(newValue))
  }, [onChange, value, format, parse])

  const onBlur = useCallback(event => validate(event.target.value), [validate])
  const onKeyDown = useCallback(event => {
    if (event.key === 'Enter') {
      validate(event.target.value)
    }
  }, [validate])
  const onInputChange = useCallback(event => setText(event.target.value), [])

  return (
    <TextInput
      {...rest}
      className={clsx('FormattedInput', className)}
      onBlur={onBlur}
      onChange={onInputChange}
      onKeyDown={onKeyDown}
      ref={ref}
      value={text}
      />
  )
})
FormattedInput.displayName = 'FormattedInput'
