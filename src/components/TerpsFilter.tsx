import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import {Button, Label} from 'flowbite-react'
import {CgClose} from 'react-icons/cg'
import {ClearFilterButton} from './FilterPane'
import {dispatch} from '@state/Action'
import {forwardRef, useState, useCallback, useRef} from 'react'
import {HiOutlineChevronDown} from "react-icons/hi"
import {IntervalTextbox} from './IntervalControl'
import {Treemap} from '@/Treemap'
import {useFloating, useClick, useDismiss, useRole, useListNavigation, useTypeahead, useInteractions, flip, offset, shift, size, FloatingFocusManager, FloatingPortal} from '@floating-ui/react'

export const AddTerpButton = ({onSelect, terps}) => {
  const terpProps = Treemap.terpenes.filter(x => x.core)

  const [expanded, setExpanded] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open: expanded,
    onOpenChange: setExpanded,
    middleware: [
      offset(8), 
      flip(), 
      shift({padding: 8}), 
      size({
        padding: 8,
        apply({availableHeight, elements}) {
          const isMobile = window.matchMedia('(width < 600px) or (height < 600px)').matches
          elements.floating.style.maxHeight = isMobile ? '80vh' : `${availableHeight}px`
        },
      }),
    ],
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef([])
  const listContentRef = useRef(terpProps.map(x => x.name))
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex,
      listRef,
      loop: true,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      activeIndex,
      onMatch: setActiveIndex,
    }),
    useRole(context, {role: 'select'}),
  ])

  const onItemClick = useCallback(name => {
    setExpanded(false)
    onSelect(name)
  }, [onSelect])

  const Floating = () => {
    const isMobile = window.matchMedia('(width < 600px) or (height < 600px)').matches
    const mobileFloatingStyles = {
      inset: 'auto 0 0',
      position: 'fixed',
    }
    return (
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false}>
          <dialog
            {...getFloatingProps()}
            open={true}
            ref={refs.setFloating}
            className="shadow TerpSelectorPopover"
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <ol className="TerpSelectorList">
              {terpProps.map((terp, index) => 
                <TerpSelectorItem 
                  {...getItemProps()}
                  disabled={terps[terp.name]}
                  key={terp.name} 
                  onClick={onItemClick} 
                  ref={node => listRef.current[index] = node}
                  tabIndex={activeIndex === index ? 0 : -1}
                  terp={terp} />
              )}
            </ol>
          </dialog>
        </FloatingFocusManager>
      </FloatingPortal>
    )
  }

  return (
    <>
      <Button
        {...getReferenceProps()}
        className="AddTerpButton w-full"
        ref={refs.setReference}>
        <span>Select Terpene</span>
        <HiOutlineChevronDown className="ml-2 h-4 w-4" />
      </Button>
      {expanded && Floating()}
    </>
  )
}

const TerpFilterItem = ({terpName, range, bound, onChange, onRemove}) => {
  const color = Treemap.terpenesByName[terpName].color
  return (
    <div className="FilterPaneItem">
      <Label
        className="FilterPaneItemLabel"
        style={{textTransform: 'capitalize', color}}
        htmlFor={'terps.' + terpName + '.min'}>
        {terpName} (%)
      </Label>
      <IntervalTextbox
        id={'terps.' + terpName}
        step={0.1}
        bound={bound.map(x => x * 100)}
        value={MathUtil.mapRange(range, x => MathUtil.roundTo(x * 100, 3))}
        onChange={range => onChange(MathUtil.mapRange(range, x => x / 100))}
      />
      <button className="ml-2" onClick={onRemove}>
        <CgClose size="1.5em" />
      </button>
    </div>
  )
}

export const TerpsFilterSection = ({terps, onChange}) => {
  const entries = ArrayUtil.sortBy(Object.entries(terps), ([terpName, _]) => Treemap.terpenesByName[terpName].index)
  const terpFilterNodes = entries.map(([terpName, range]) => {
    const bound = [0, 1]
    return <TerpFilterItem 
      key={terpName}
      terpName={terpName}
      range={range}
      bound={bound}
      onChange={range => onChange({...terps, [terpName]: range})}
      onRemove={() => onChange(ObjectUtil.delete(terps, terpName))}
    />
  })

  const clearButton = !ObjectUtil.isEmpty(terps)
    ? <ClearFilterButton onClick={() => onChange({})} />
    : undefined

  return (
    <fieldset className="FilterPaneSection TerpsFilterSection">
      <legend>
        <span>Terpenes</span>
        {clearButton}
      </legend>
      <AddTerpButton
        onSelect={terpName => dispatch({type: 'filter.addTerp', terpName})}
        terps={terps}
        />
      {terpFilterNodes}
    </fieldset>
  )
}

export const TerpSelectorItem = forwardRef(function TerpSelectorItem({terp, onClick, ...props}, ref) {
  const name = <div className="TerpSelectorName" style={{color: terp.color}}>{terp.name}</div>
  const scents = terp.scents
    ? <div className="TerpSelectorScents">Scents: {terp.scents}</div>
    : undefined
  const properties = terp.properties && terp.properties.length
    ? <div className="TerpSelectorProperties">Properties: {terp.properties.join(', ')}</div>
    : undefined

  return (
    <li>
      <button
        {...props}
        className="TerpSelectorItem"
        onClick={() => onClick && onClick(terp.name)}
        ref={ref}
        style={{borderColor: terp.color}}>
        {name}
        {scents}
        {properties}
      </button>
    </li>
  )
})
