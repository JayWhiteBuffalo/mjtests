import clsx from 'clsx'
import {orEmpty} from '@util/ValidationUtil'
import {Input} from '@nextui-org/react'
import {useState, useEffect, useCallback} from 'react'

type IntervalTextboxProps = {
  id: string
  bound: [number, number]
  value: [number, number]
  step?: number
  onChange: (interval: [number, number]) => void
}

const enDash = '–'

export const IntervalLabel = ({bound, value, labelFn}) => {
  const f = labelFn || (x => x)

  const text = () => {
    if (value[0] === bound[0]) {
      if (value[1] === bound[1]) {
        return null
      } else {
        return '< ' + f(value[1])
      }
    } else {
      if (value[1] === bound[1]) {
        return '> ' + f(value[0])
      } else {
        return [f(value[0]), enDash, f(value[1])].join(' ')
      }
    }
  }

  return <span className="IntervalLabel">{text()}</span>
}

const IntervalTextboxItem = ({bound, value, onChange, ...rest}) => {
  const [focus, setFocus] = useState(false)
  const [text, setText] = useState(orEmpty(value))

  useEffect(() => {
    if (!focus) {
      const newText = orEmpty(value)
      if (text !== newText) {
        setText(newText)
      }
    }
  }, [value, focus, text])

  const validate = useCallback(
    xString => {
      if (xString === '') {
        return undefined
      }

      const x = +xString
      if (bound[0] <= x && x <= bound[1]) {
        return x
      } else if (x < bound[0]) {
        return bound[0]
      } else if (bound[1] < x) {
        return bound[1]
      } else {
        return undefined
      }
    },
    [bound],
  )

  const onBlur = useCallback(
    event => {
      setFocus(false)
      const x = validate(event.target.value)
      if (x !== value) {
        onChange(x)
      }
    },
    [value, validate, onChange],
  )

  const onKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        const x = validate(event.target.value)
        setText(orEmpty(x))
        onChange(x)
      }
    },
    [validate, onChange],
  )

  const onValueChange = useCallback(
    value => {
      setText(value)
      const x = +value
      if (bound[0] <= x && x <= bound[1]) {
        onChange(x)
      }
    },
    [bound, onChange],
  )

  return (
    <Input
      className="w-[80px]"
      max={bound[1]}
      min={bound[0]}
      onBlur={onBlur}
      onValueChange={onValueChange}
      onFocus={useCallback(() => setFocus(true), [])}
      onKeyDown={onKeyDown}
      type="number"
      classNames={{
        inputWrapper: 'pr-0',
        input: 'text-center',
      }}
      value={text}
      {...rest}
    />
  )
}

export const IntervalTextbox = ({
  id,
  className,
  bound,
  value,
  step,
  onChange,
}: IntervalTextboxProps) => (
  <div className={clsx('flex gap-1', className)}>
    <IntervalTextboxItem
      id={id + '.min'}
      placeholder="MIN"
      bound={bound}
      step={step ?? 1}
      value={value[0]}
      onChange={x => onChange([x, value[1]])}
    />
    <IntervalTextboxItem
      id={id + '.max'}
      placeholder="MAX"
      bound={bound}
      step={step ?? 1}
      value={value[1]}
      onChange={x => onChange([value[0], x])}
    />
  </div>
)
