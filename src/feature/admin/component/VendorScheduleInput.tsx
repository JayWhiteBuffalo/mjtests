import clsx from 'clsx'
import DateUtil from '@util/DateUtil'
import ObjectUtil from '@util/ObjectUtil'
import {Checkbox, Input} from '@nextui-org/react'
import {FieldError, RecursiveErrors} from '@/feature/shared/component/Form'
import {
  Fragment,
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import {VendorSchedule} from '@util/VendorSchedule'

const timeToText = time => (time != null ? DateUtil.formatAmPm(time) : '')

export const TimeOfDay = forwardRef(
  ({value, onChange, className, ...rest}, ref) => {
    const [text, setText] = useState(timeToText(value))

    useEffect(() => setText(timeToText(value)), [value])

    const validate = useCallback(
      x => {
        const time = DateUtil.parseAmPm(x.trim())
        if (time !== value) {
          onChange(time)
        }
        setText(timeToText(time))
      },
      [onChange, value],
    )

    const onBlur = useCallback(
      event => validate(event.target.value),
      [validate],
    )
    const onKeyDown = useCallback(
      event => {
        if (event.key === 'Enter') {
          validate(event.target.value)
        }
      },
      [validate],
    )

    return (
      <Input
        className={clsx('w-[90px]', className)}
        onBlur={onBlur}
        onValueChange={setText}
        onKeyDown={onKeyDown}
        ref={ref}
        value={text}
        {...rest}
      />
    )
  },
)
TimeOfDay.displayName = 'TimeOfDay'

const valueToRange = value => {
  if (value === 'unknown') {
    return [undefined, undefined]
  } else if (value instanceof Array) {
    return [value[0], value[1] % (24 * 3600)]
  } else {
    return undefined
  }
}

const rangeToValue = range => {
  if (range[0] == null || range[1] == null) {
    return 'unknown'
  } else {
    if (range[0] >= range[1]) {
      return [range[0], range[1] + 24 * 3600]
    } else {
      return range
    }
  }
}

export const DaySchedule = ({value, disabled, onChange}) => {
  const [range, setRange] = useState(
    valueToRange(value) ?? [undefined, undefined],
  )

  useEffect(() => {
    if (!ObjectUtil.equals(rangeToValue(range), value)) {
      setRange(range => valueToRange(value) ?? range)
    }
  }, [value, range])

  return (
    <>
      <Checkbox
        checked={value !== 'closed'}
        isDisabled={disabled}
        onValueChange={checked => {
          if (checked) {
            onChange(rangeToValue(range))
          } else {
            onChange('closed')
          }
        }}
      >
        Open
      </Checkbox>
      <TimeOfDay
        disabled={value === 'closed' || disabled}
        onChange={time => {
          setRange([time, range[1]])
          onChange(rangeToValue([time, range[1]]))
        }}
        value={range[0]}
      />
      <TimeOfDay
        disabled={value === 'closed' || disabled}
        onChange={time => {
          setRange([range[0], time])
          onChange(rangeToValue([range[0], time]))
        }}
        value={range[1]}
      />
    </>
  )
}

const Header = ({title}) => (
  <div className="contents font-bold">
    <p className="col-span-2">{title}</p>
    <p>Opens at</p>
    <p>Closes at</p>
  </div>
)

const VendorScheduleGrid = ({children}) => (
  <div
    className="grid gap-2 items-center my-4"
    style={{
      gridTemplateColumns: 'auto min-content max-content max-content',
    }}
  >
    {children}
  </div>
)

const WeekHours = ({week, errors, onChange}) => (
  <VendorScheduleGrid>
    <Header title="Weekly Hours" />

    {VendorSchedule.daysOfWeek.map((dayOfWeek, ix) => (
      <Fragment key={ix}>
        <div>{dayOfWeek.name}</div>

        <DaySchedule
          className="mr-4"
          onChange={daySchedule =>
            onChange(week.toSpliced(ix, 1, daySchedule))
          }
          value={week[ix]}
        />

        <RecursiveErrors className="col-span-full" errors={errors?.[ix]} />
      </Fragment>
    ))}
  </VendorScheduleGrid>
)

const HolidayHours = ({special, errors, onChange}) => {
  const daySchedules = useRef(special)

  useEffect(() => Object.assign(daySchedules.current, special)[special])

  return (
    <VendorScheduleGrid>
      <Header title="Holiday Hours" />

      {VendorSchedule.getNamedDaysForYear().map(({key, day}) => (
        <Fragment key={key}>
          <Checkbox
            checked={key in special}
            onValueChange={checked => {
              if (checked) {
                onChange({...special, [key]: daySchedules.current[key]})
              } else {
                onChange(ObjectUtil.delete(special, key))
              }
            }}
          >
            <time>
              {day} {VendorSchedule.namedDaysByKey[key].name}
            </time>
          </Checkbox>

          <DaySchedule
            className="mr-4"
            disabled={!(key in special)}
            onChange={daySchedule => {
              daySchedules.current[key] = daySchedule
              onChange({...special, [key]: daySchedule})
            }}
            value={special[key] ?? daySchedules[key] ?? 'unknown'}
          />

          <RecursiveErrors className="col-span-full" errors={errors?.[key]} />
        </Fragment>
      ))}
    </VendorScheduleGrid>
  )
}

//const SpecialHours = ({special, errors, onChange}) =>

export const VendorScheduleInput = ({schedule, errors, onChange}) => (
  <>
    <WeekHours
      week={schedule.week}
      onChange={week => onChange({...schedule, week})}
      errors={errors?.week}
    />
    <FieldError error={errors?.week} />
    {/*
    <HolidayHours
      special={schedule.special}
      onChange={special => onChange({...schedule, special})}
      errors={errors?.special}
    />
    <FieldError error={errors?.special} />
    */}
  </>
)
