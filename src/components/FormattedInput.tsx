import {forwardRef, useEffect, useState, useCallback} from 'react'
import {Input} from '@nextui-org/react'

export const FormattedInput = forwardRef(({value, defaultValue, format, parse, onChange, ...rest}, ref) => {
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

  return (
    <Input
      onBlur={onBlur}
      onValueChange={setText}
      onKeyDown={onKeyDown}
      ref={ref}
      value={text}
      {...rest}
    />
  )
})
FormattedInput.displayName = 'FormattedInput'
