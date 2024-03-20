import './TerpeneSelector.css'
import clsx from 'clsx'
import {Button} from 'flowbite-react'
import {forwardRef, useState, useCallback, useRef} from 'react'
import {HiOutlineChevronDown} from "react-icons/hi"
import {Treemap} from '@/Treemap'
import {useFloating, useClick, useDismiss, useRole, useListNavigation, useTypeahead, useInteractions, flip, offset, shift, size, FloatingFocusManager, FloatingPortal} from '@floating-ui/react'

export const TerpeneSelectorItem = forwardRef(({terp, disabled, onClick, showDetails, ...props}, ref) =>
  <li>
    <button
      {...props}
      className={clsx(
        'TerpeneSelectorItem',
        'block border-t-2 text-gray-700 text-sm w-full text-left pb-1',
         disabled ? 'opacity-70 bg-green-300' : 'hover:bg-gray-100',
      )}
      disabled={disabled}
      onClick={() => onClick && onClick(terp.name)}
      ref={ref}
      style={{borderColor: terp.color}}
      type="button">
      <p className="text-xl leading-tight capitalize" style={{color: terp.color}}>
        {terp.name}
      </p>
      {
        showDetails && terp.scents
          ? <p>Scents: {terp.scents}</p>
          : undefined
      }
      {
        showDetails && terp.properties && terp.properties.length
          ? <p className="leading-tight">Properties: {terp.properties.join(', ')}</p>
          : undefined
      }
    </button>
  </li>
)
TerpeneSelectorItem.displayName = 'TerpeneSelectorItem'


export const TerpeneSelector = ({onSelect, disabledTerps = {}}) => {
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
            className={clsx(
              'shadow TerpeneSelectorPopover',
              'bg-white border border-gray-300 max-h-[80vh] overflow-scroll p-3 z-20',
            )}
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <ul className="TerpeneSelectorList grid text-xs gap-x-2">
              {terpProps.map((terp, index) =>
                <TerpeneSelectorItem
                  {...getItemProps()}
                  disabled={disabledTerps[terp.name]}
                  key={terp.name}
                  onClick={onItemClick}
                  ref={node => listRef.current[index] = node}
                  tabIndex={activeIndex === index ? 0 : -1}
                  terp={terp} />
              )}
            </ul>
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
