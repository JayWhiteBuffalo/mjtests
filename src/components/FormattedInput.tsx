import {forwardRef, useEffect, useState, useCallback} from 'react'
import {Input} from '@nextui-org/react'

export const FormattedInput = forwardRef(({value, defaultValue, format, parse, onChange, onBlur, ...rest}, ref) => {
  const [text, setText] = useState(format(defaultValue ?? value))

  useEffect(() => setText(format(value)), [value, format])

  const validate = useCallback(newText => {
    const newValue = parse(newText)
    if (newValue !== value) {
      onChange(newValue)
    }
    setText(format(newValue))
  }, [onChange, value, format, parse])

  return (
    <Input
      onBlur={useCallback(event => {
        validate(event.target.value)
        onBlur?.()
      }, [validate, onBlur])}
      onValueChange={setText}
      onKeyDown={useCallback(event => {
        if (event.key === 'Enter') {
          validate(event.target.value)
        }
      }, [validate])}
      ref={ref}
      value={text}
      {...rest}
    />
  )
})
FormattedInput.displayName = 'FormattedInput'
