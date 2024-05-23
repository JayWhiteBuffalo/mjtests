import MathUtil from '@util/MathUtil'
import {FormattedInput} from '@/feature/shared/component/FormattedInput'
import {forwardRef, Fragment} from 'react'
import {FieldError} from '@/feature/shared/component/Form'
import {Treemap} from '@/Treemap'
import {unNan, mapDefined} from '@util/ValidationUtil'

export const PotencyTableInput = ({potency, errors, onChange}) => {
  const makePotencyRow = (name, label) => (
    <>
      <div className="contents">
        <label htmlFor={`potency.${name}`}>{label}</label>
        <PotencyInput
          className="mr-4"
          id={`potency.${name}`}
          onChange={value => onChange({...potency, [name]: value})}
          value={potency[name]}
        />
      </div>
      <FieldError className="col-end-[-1]" error={errors?.[name]} />
    </>
  )

  return (
    <div
      className="grid items-center gap-2"
      style={{gridTemplateColumns: '240px 120px'}}
    >
      <div className="contents font-bold">
        <p>Ingredient</p>
        <div>
          <p>Concentration</p>
          <span className="text-xs font-normal">(% by weight)</span>
        </div>
      </div>

      {makePotencyRow('thc', 'THC %')}
      {makePotencyRow('thca', 'THCA %')}
      {makePotencyRow('delta8', 'Delta-8 %')}
      {makePotencyRow('cbd', 'CBD %')}

      <FieldError error={errors} />
    </div>
  )
}

export const TerpeneInput = ({terps, errors, onChange}) => {
  const terpProps = Treemap.terpenes.filter(x => x.core)

  return (
    <div
      className="grid items-center gap-2"
      style={{gridTemplateColumns: '240px 120px'}}
    >
      <div className="contents font-bold">
        <p>Terpene</p>
        <div>
          <p>Concentration</p>
          <span className="text-xs font-normal">(% by weight)</span>
        </div>
      </div>
      {terpProps.map(({name}) => (
        <Fragment key={name}>
          <div className="contents">
            <label htmlFor={`terps.${name}`}>{name}</label>
            <PotencyInput
              className="mr-4"
              id={`terps.${name}`}
              onChange={value => onChange({...terps, [name]: value})}
              value={terps[name]}
            />
          </div>
          <FieldError className="col-end-[-1]" error={errors?.[name]} />
        </Fragment>
      ))}

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

const parsePercent = x =>
  mapDefined(unNan(x), x => MathUtil.roundTo(x / 100, 6))

export const PotencyInput = forwardRef(({...rest}, ref) => (
  <FormattedInput
    format={formatPercent}
    parse={parsePercent}
    ref={ref}
    placeholder="00.0000%"
    step={1e-4}
    {...rest}
  />
))
PotencyInput.displayName = 'PotencyInput'
