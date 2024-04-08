import './TerpeneInput.css'
import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import {Label} from 'flowbite-react'
import {FormattedInput} from '@components/FormattedInput'
import {forwardRef, Fragment} from 'react'
import {TerpeneSelector} from '@components/TerpeneSelector'
import {Treemap} from '@/Treemap'
import {unNan, mapDefined} from '@util/ValidationUtil'
import {RemoveButton, FieldError} from '@components/Form'


export const TerpeneInput = ({terps, errors, onChange}) => {
  const entries = ArrayUtil.sortBy(Object.entries(terps), ([terpName, _]) => Treemap.terpenesByName[terpName].index)

  return (
    <div className="TerpeneInput items-center">
      <div className="TerpeneInputHeader">
        <p>Terpene</p>
        <div>
          <p>Concentration</p>
          <span className="text-xs font-normal">(% by weight)</span>
        </div>
        <p />
      </div>

      {entries.map(([terpName, value]) =>
        <Fragment key={terpName}>
          <div className="TerpeneInputItem">
            <Label htmlFor={`terps.${terpName}`}>{terpName}</Label>
            <PotencyInput
              id={`terps.${terpName}`}
              onChange={value => onChange({...terps, [terpName]: value})}
              value={value}
            />
            <RemoveButton onClick={() => onChange(ObjectUtil.delete(terps, terpName))} />
          </div>
          <FieldError error={errors?.[terpName]} />
        </Fragment>
      )}
      <TerpeneSelector
        onSelect={terpName => onChange({[terpName]: undefined, ...terps})}
        />
      <FieldError error={errors} />
    </div>
  )
}

const formatPercent = x => {
  if (x !== undefined) {
    const y = MathUtil.roundTo(100 * x, 6)
    if (Math.round(y) === y) {
      return y.toFixed(1) + '%'
    } else {
      return y.toString() + '%'
    }
  } else {
    return ''
  }
}

const parsePercent = x => mapDefined(unNan(x), x => MathUtil.roundTo(x / 100, 6))

export const PotencyInput = forwardRef(({...rest}, ref) =>
  <FormattedInput
    format={formatPercent}
    parse={parsePercent}
    ref={ref}
    step={1e-4}
    {...rest}
  />
)
PotencyInput.displayName = 'PotencyInput'
