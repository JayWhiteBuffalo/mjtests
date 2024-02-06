import './IntervalControl.css'
import {TextInput} from 'flowbite-react'
import {useState} from 'react'

type IntervalTextboxProps = {
  id: string,
  bound: [number, number],
  value: [number, number],
  step?: number,
  onChange: (interval: [number, number]) => void,
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
  const [text, setText] = useState('')

  const valueToText = value => value !== undefined ? value.toString() : ''
  if (!focus) {
    const newText = valueToText(value)
    if (text !== newText) {
      setText(newText)
    }
  }

  const validate = xString => {
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
  }

  return (
    <TextInput
      {...rest}
      className="IntervalTextboxItem"
      min={bound[0]}
      max={bound[1]}
      type="number"
      value={text}
      onFocus={() => setFocus(true)}
      onBlur={e => {
        setFocus(false)
        const x = validate(e.target.value)
        if (x !== value) {
          onChange(x)
        }
      }}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          const x = validate(e.target.value)
          setText(valueToText(x))
          onChange(x)
        }
      }}
      onChange={e => {
        setText(e.target.value)
        const x = +e.target.value
        if (bound[0] <= x && x <= bound[1]) {
          onChange(x)
        }
      }} />
  )
}

export const IntervalTextbox = ({id, className, bound, value, step, onChange}: IntervalTextboxProps) => {
  return (
    <div className={`IntervalTextbox ${className}`}>
      <IntervalTextboxItem
        id={id + '.min'}
        placeholder="MIN"
        bound={bound}
        step={step || 1}
        value={value[0]}
        onChange={x => onChange([x, value[1]])} />
      <IntervalTextboxItem 
        id={id + '.max'}
        placeholder="MAX"
        bound={bound}
        step={step || 1}
        value={value[1]}
        onChange={x => onChange([value[0], x])} />
    </div>
  )
}

