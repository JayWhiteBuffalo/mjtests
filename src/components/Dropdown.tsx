import './Dropdown.css'
import clsx from 'clsx'
import {Button, TextInput} from 'flowbite-react'
import {autoUpdate, useFloating, useClick, useDismiss, useRole, useInteractions, useListNavigation, useTypeahead, flip, offset, shift, size, FloatingPortal, FloatingFocusManager} from '@floating-ui/react'
import {HiOutlineChevronDown} from "react-icons/hi"
import {setRef} from '@util/ReactUtil'
import {useFluxStore} from '@/state/Flux'
import {useState, useRef, useCallback, useEffect, forwardRef} from 'react'

export const DropdownMenuButton = ({className, disabled, children, ...rest}) =>
  <button
    className={clsx(
      'px-1 text-sm', 
      disabled ? 'text-gray-500' : 'text-cyan-700',
      className,
    )}
    disabled={disabled}
    type="button"
    {...rest}>
    {children}
  </button>

type DropdownItem = {
  key: string,
  name: string,
}

const Items = forwardRef(({className, items, value, getItemProps, listRef, activeIndex, onChange, ...rest}, ref) =>
  <ul
    {...rest}
    className={clsx(
      'DropdownItems', 
      'max-h-[480px] min-w-[208px]',
      'flex flex-col flex-1 shrink-0 overflow-auto -m-3',
      className,
    )}
    ref={ref}>
    {items.map((item, index) =>
      <li
        {...getItemProps({
          onClick: () => onChange(item.key),
        })}
        className={clsx(
          'cursor-pointer hyphens-auto px-2 py-1 text-left hover:bg-gray-100',
          index === activeIndex && 'bg-gray-100',
        )}
        key={item.key}
        ref={node => listRef.current[index] = node}
        tabIndex={-1}>
        {item.name}
      </li>
    )}
  </ul>
)
Items.displayName = 'Items'

const commonMiddleware = ({padding = 8} = {}) =>
  [
    offset(padding),
    flip(),
    shift({padding}),
    size({
      padding,
      apply({availableHeight, elements}) {
        const isMobile = window.matchMedia('(width < 600px) or (height < 600px)').matches
        elements.floating.style.maxHeight = isMobile ? '80vh' : `${availableHeight}px`
        elements.floating.style.width = `${elements.reference.offsetWidth}px`
      },
    }),
  ]

const DropdownTopMenu = ({onClose}) =>
  <div className="flex justify-between items-end">
    <DropdownMenuButton
      className="DropdownCloseButton"
      onClick={onClose}>
      Done
    </DropdownMenuButton>
  </div>

const DropdownButton = forwardRef(({placeholder, value, readOnly, className, ...rest}, ref) => {
  let text
  if (value != null) {
    text = value
  } else if (placeholder) {
    text = <span className="placeholder">{placeholder}</span>
  } else if (readOnly) {
    text = <span className="placeholder">None</span>
  } else {
    text = <span className="placeholder">Select</span>
  }

  const theme = {
    color: {
      failure: clsx(
        'text-red-900 bg-red-50 border border-red-500 focus:border-red-500 focus:ring-red-500 enabled:hover:bg-red-100 focus:ring-1',
        'dark:text-white dark:bg-gray-600 dark:border-gray-600 dark:enabled:hover:bg-gray-700 dark:enabled:hover:border-gray-700 dark:focus:ring-gray-700',
      ),
      light: clsx(
        'text-gray-900 bg-gray-50 border border-gray-300 enabled:hover:bg-gray-100 focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1',
        'dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:enabled:hover:bg-gray-700 dark:enabled:hover:border-gray-700 dark:focus:ring-gray-700',
      ),
    },
    inner: {
      base: 'flex items-stretch items-center justify-between w-full transition-all duration-200',
    },
  }

  return (
    <Button
      color="light"
      {...rest}
      theme={theme}
      className={clsx(
        'Dropdown', 
        'w-full max-w-[300px]',
        readOnly && 'bg-zinc-200 cursor-not-allowed', 
        className,
      )}
      ref={ref}>
      <span className="DropdownText overflow-hidden text-ellipsis whitespace-nowrap">{text}</span>
      {!readOnly ? <HiOutlineChevronDown className="ml-2 h-4 w-4" /> : undefined}
    </Button>
  )
})
DropdownButton.displayName = 'DropdownButton'

type DropdownProps = {
  items: Array<DropdownItem>,
  onChange: (value: string) => void,
  placeholder?: string,
  value: string,
}

export const Dropdown = forwardRef(({value, items, disabled, readOnly, onChange, ...rest}: DropdownProps, ref) => {
  const [expanded, setExpanded] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    middleware: commonMiddleware({padding: 4}),
    onOpenChange: setExpanded,
    open: expanded,
    whileElementsMounted: autoUpdate,
  })

  const selectedIndex_ = items.findIndex(item => value === item.key)
  const selectedIndex = selectedIndex_ >= 0 ? selectedIndex_ : undefined
  const [activeIndex, setActiveIndex] = useState(selectedIndex ?? 0)
  const listRef = useRef([])
  const listContentRef = useRef(items.map(x => x.name))
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'select'}),
    useClick(context, {enabled: !disabled && !readOnly}),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex,
      enabled: !disabled && !readOnly,
      listRef,
      loop: true,
      onNavigate: setActiveIndex,
      selectedIndex,
      virtual: true,
    }),
    useTypeahead(context, {
      enabled: !disabled && !readOnly,
      listRef: listContentRef,
      activeIndex,
      onMatch: setActiveIndex,
    }),
  ])

  const onKeyDownReference = useCallback(event => {
    if (event.key === 'Enter' && expanded && activeIndex != null) {
      if (activeIndex < items.length) {
        onChange(items[activeIndex].key)
        event.preventDefault()
      }
      setExpanded(false)
    }
  }, [onChange, activeIndex, items, expanded])

  const onChangeItem = useCallback(value => {
    onChange(value)
    setExpanded(false)
  }, [onChange])

  const onClose = useCallback(() => setExpanded(false), [])

  const Floating = () => {
    const isMobile = window.matchMedia('(width < 600px) or (height < 600px)').matches
    const mobileFloatingStyles = {
      inset: 'auto 0 0',
      position: 'fixed',
    }
    return (
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
          <div
            {...getFloatingProps({})}
            className={clsx(
              `DropdownPopover DropdownPane shadow`,
              'bg-white border border-gray-300 z-20',
              'max-h-[80vh]',
              'flex flex-1 px-3 flex-col',
            )}
            ref={refs.setFloating}
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <DropdownTopMenu onClose={onClose} />
            <Items
              activeIndex={activeIndex}
              getItemProps={getItemProps}
              items={items}
              listRef={listRef}
              onChange={onChangeItem}
              value={value}
            />
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    )
  }

  return (
    <>
      <DropdownButton
        {...rest}
        {...getReferenceProps({onKeyDown: onKeyDownReference})}
        disabled={disabled}
        readOnly={readOnly}
        ref={elem => {refs.setReference(elem); setRef(ref, elem)}}
        value={selectedIndex !== -1 ? items[selectedIndex]?.name : undefined}
        />
      {expanded && Floating()}
    </>
  )
})
Dropdown.displayName = 'Dropdown'





const TypeaheadKeyword = forwardRef(({value, className, ...rest}, ref) => {
  return (
    <TextInput
      {...rest}
      aria-autocomplete="list"
      autoComplete="off"
      className={clsx('Typeahead', className)}
      ref={ref}
      type="search"
      value={value}
      />
  )
})
TypeaheadKeyword.displayName = 'TypeaheadKeyword'


type TypeaheadProps = {
  onChange: (value: string) => void,
  placeholder?: string,
  TypeaheadStore: any,
  value: string,
}

export const Typeahead = forwardRef(({value, TypeaheadStore, onChange, ...rest}: TypeaheadProps, ref) => {
  const [expanded, setExpanded] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    middleware: commonMiddleware({padding: 0}),
    onOpenChange: setExpanded,
    open: expanded,
    whileElementsMounted: autoUpdate,
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef([])
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'combobox'}),
    useClick(context),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex,
      listRef,
      loop: true,
      onNavigate: index => index != null && setActiveIndex(index),
      virtual: true,
    }),
  ])

  const [keyword, setKeyword] = useState(value ?? '')
  useFluxStore(TypeaheadStore)
  const items = TypeaheadStore.search(keyword)

  useEffect(() => setKeyword(value ?? ''), [value, TypeaheadStore])

  const onChangeKeyword = useCallback(event => {
    setActiveIndex(0)
    setExpanded(true)
    setKeyword(event.target.value)
    onChange(event.target.value)
  }, [onChange])

  const onKeyDownKeyword = useCallback(event => {
    if (event.key === 'Enter' && expanded && activeIndex != null) {
      if (activeIndex < items.length) {
        onChange(items[activeIndex].key)
        setKeyword(items[activeIndex].name)
        event.preventDefault()
      }
      setActiveIndex(undefined)
      setExpanded(false)
    }
  }, [onChange, activeIndex, items, expanded])

  const onChangeItem = useCallback(value => {
    onChange(value)
    setExpanded(false)
  }, [onChange])

  const onClose = useCallback(() => setExpanded(false), [])

  const Floating = () =>
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
        <div
          {...getFloatingProps()}
          ref={refs.setFloating}
          className={clsx(
            'DropdownPopover DropdownPane', 
            'bg-white border border-gray-300 z-20',
            !items.length && 'invisible',
            'flex flex-1 px-3 flex-col',
          )}
          style={floatingStyles}>
          <DropdownTopMenu onClose={onClose} />
          <Items
            activeIndex={activeIndex}
            getItemProps={getItemProps}
            items={items}
            listRef={listRef}
            onChange={onChangeItem}
            value={value}
          />
        </div>
      </FloatingFocusManager>
    </FloatingPortal>

  return (
    <>
      <TypeaheadKeyword
        {...rest}
        {...getReferenceProps({onChange: onChangeKeyword, onKeyDown: onKeyDownKeyword})}
        ref={elem => {refs.setReference(elem); setRef(ref, elem)}}
        value={keyword}
        />
      {expanded && Floating()}
    </>
  )
})
Typeahead.displayName = 'Typeahead'

