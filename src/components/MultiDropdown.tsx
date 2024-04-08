import './MultiDropdown.css'
import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import FlagObjectUtil from '@util/FlagObjectUtil'
import FnUtil from '@util/FnUtil'
import ObjectUtil from '@util/ObjectUtil'
import {Button, Checkbox, TextInput} from 'flowbite-react'
import {CgSearch} from 'react-icons/cg'
import {DropdownMenuButton} from '@components/Dropdown'
import {ErrorBoundary} from '@components/Error'
import {HiOutlineChevronDown} from "react-icons/hi"
import {useFloating, useClick, useDismiss, useRole, useInteractions, useListNavigation, useTypeahead, flip, offset, shift, size, FloatingPortal, FloatingFocusManager} from '@floating-ui/react'
import {useFluxStore} from '@/state/Flux'
import {useState, useRef, useCallback, forwardRef} from 'react'

type MultiDropdownItem = {
  key: string,
  name: string,
}

const MultiDropdownButton = forwardRef(({placeholder, values, className, ...rest}, ref) => {
  const selectedCount = ObjectUtil.size(values)
  const text = selectedCount === 0 && placeholder && <span className="placeholder">{placeholder}</span>
    || `${selectedCount} selected`

  return (
    <Button
      className={clsx('MultiDropdown', className)}
      color="light"
      ref={ref}
      theme={{
        inner: {base: 'flex items-stretch items-center justify-between w-full transition-all duration-200'},
      }}
      {...rest}>
      <span
        className="text-ellipsis overflow-hidden whitespace-nowrap text-gray-500 italic">
        {text}
      </span>
      <HiOutlineChevronDown className="ml-2 h-4 w-4" />
    </Button>
  )
})
MultiDropdownButton.displayName = 'MultiDropdownButton'

const Items = forwardRef(({className, items, values, getItemProps, listRef, activeIndex, onChange, ...rest}, ref) =>
  <ul
    className={clsx(
      'MultiDropdownItems',
      'flex flex-col flex-wrap flex-auto shrink-0 h-[400px] -mx-3 overflow-auto px-1',
      'min-w-[208px]',
      className,
    )}
    ref={ref}
    {...rest}>
    {items.map((item, index) =>
      <li key={item.key}>
        <button
          {...getItemProps({
            onClick: () => onChange(FlagObjectUtil.toggle(values, item.key)),
          })}
          aria-selected={values[item.key] || false}
          className={clsx(
            'cursor-pointer hyphens-auto px-2 py-1 text-left w-[200px]',
            'hover:bg-gray-100'
          )}
          ref={node => listRef.current[index] = node}
          role="option"
          tabIndex={activeIndex === index ? 0 : -1}
          type="button">
          <Checkbox
            checked={values[item.key] || false}
            className="mr-1 cursor-unset align-text-bottom"
            onChange={FnUtil.void}
            role="presentation"
            tabIndex={-1}
          />
          {item.name}
        </button>
      </li>
    )}
  </ul>
)
Items.displayName = 'Items'

const commonMiddleware = () =>
  [
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
  ]

const SmallMultiDropdownTopMenu = ({values, items, onChange, onClose}) =>
  <div className="flex justify-between items-end">
    {items.length &&
      <div>
        <DropdownMenuButton
          disabled={items.every(item => values[item.key])}
          onClick={() => onChange(FlagObjectUtil.fromIterable(items, x => x.key))}>
          Select All
        </DropdownMenuButton>
        <DropdownMenuButton
          disabled={ObjectUtil.isEmpty(values)}
          onClick={() => onChange({})}>
          Clear Selection
        </DropdownMenuButton>
      </div>
    }
    <DropdownMenuButton
      className="MultiDropdownCloseButton"
      onClick={onClose}>
      Done
    </DropdownMenuButton>
  </div>

type SmallMultiDropdownProps = {
  className: string,
  id: string,
  Item: any,
  items: Array<MultiDropdownItem>,
  label?: string,
  onChange: (values: object) => void,
  placeholder?: string,
  values: object,
}

export const SmallMultiDropdown = (props: SmallMultiDropdownProps) => {
  const [expanded, setExpanded] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open: expanded,
    onOpenChange: setExpanded,
    middleware: commonMiddleware(),
  })
  const firstSelectedIndex = props.items.findIndex(item => props.values[item.key])
  const [activeIndex, setActiveIndex] = useState(firstSelectedIndex !== -1 ? firstSelectedIndex : 0)
  const listRef = useRef([])
  const listContentRef = useRef(props.items.map(x => x.name))
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'combobox'}),
    useClick(context),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex,
      listRef,
      loop: true,
      onNavigate: index => index != null && setActiveIndex(index),
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      activeIndex,
      onMatch: setActiveIndex,
    }),
  ])

  const onClose = useCallback(() => setExpanded(false), [])

  const Floating = () => {
    const isMobile = window.matchMedia('(width < 600px) or (height < 600px)').matches
    const mobileFloatingStyles = {
      inset: 'auto 0 0',
      position: 'fixed',
    }
    return (
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false}>
          <div
            {...getFloatingProps()}
            aria-multiselectable="true"
            className={clsx(
              `MultiDropdownPopover shadow`,
              'bg-white border border-gray-300 flex flex-row z-20',
              'max-h-[80vh]',
            )}
            ref={refs.setFloating}
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <ErrorBoundary>
              <div
                className={clsx(
                  'MultiDropdownPane MultiDropdownItemsPane',
                  'flex flex-1 flex-col p-3',
                )}>
                <SmallMultiDropdownTopMenu
                  items={props.items}
                  onChange={props.onChange}
                  onClose={onClose}
                  values={props.values}
                />
                <Items
                  activeIndex={activeIndex}
                  getItemProps={getItemProps}
                  items={props.items}
                  listRef={listRef}
                  onChange={props.onChange}
                  values={props.values}
                />
              </div>
            </ErrorBoundary>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    )
  }

  return (
    <>
      <MultiDropdownButton
        {...getReferenceProps()}
        className={props.className}
        id={props.id}
        placeholder={props.placeholder}
        ref={refs.setReference}
        values={props.values}
      />
      {expanded && Floating()}
    </>
  )
}

const Search = ({id, keyword, onChange}) =>
  <TextInput
    className="max-w-[600px] mb-1"
    icon={CgSearch}
    id={id}
    onChange={e => onChange(e.target.value)}
    placeholder="Filter list"
    tabIndex={0}
    type="search"
    value={keyword}
  />

const MultiDropdownSelectedPane = ({id, values, TypeaheadStore, onChange, onClose}: MultiDropdownProps) => {
  const selectedItems = ArrayUtil.sortBy(
    TypeaheadStore.getByKeys(Object.keys(values)),
    x => x.name
  )

  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const {refs, context} = useFloating({open: true})
  const listRef = useRef([])
  const {getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'select'}),
    useListNavigation(context, {
      enabled: focused,
      activeIndex,
      listRef,
      loop: true,
      onNavigate: index => index != null && setActiveIndex(index),
      focusItemOnHover: false,
      focusItemOnOpen: false,
    }),
  ])

  return (
    <div
      className={clsx(
        'MultiDropdownPane MultiDropdownSelectedPane',
        'flex flex-1 flex-col p-3',
      )}>
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm mr-4">Selected</span>
          <DropdownMenuButton
            disabled={ObjectUtil.isEmpty(values)}
            onClick={() => onChange({})}>
            Clear Selection
          </DropdownMenuButton>
        </div>
        <DropdownMenuButton
          className="MultiDropdownCloseButton"
          onClick={onClose}>
          Done
        </DropdownMenuButton>
      </div>

      <Items
        {...getFloatingProps({
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
        })}
        ref={refs.setFloating}
        activeIndex={activeIndex}
        aria-multiselectable="true"
        getItemProps={getItemProps}
        id={`${id}.selected`}
        items={selectedItems}
        listRef={listRef}
        onChange={onChange}
        values={values}
      />
    </div>
  )
}

const MultiDropdownSearchPane = ({id, values, TypeaheadStore, onChange}: MultiDropdownProps) => {
  const [keyword, setKeyword] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  useFluxStore(TypeaheadStore)

  const {refs, context} = useFloating({open: true})
  const listRef = useRef([])
  const {getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'combobox'}),
    useListNavigation(context, {
      enabled: focused,
      activeIndex,
      listRef,
      loop: true,
      onNavigate: index => index != null && setActiveIndex(index),
      focusItemOnHover: false,
      focusItemOnOpen: false,
    }),
  ])

  return (
    <div
      className={clsx(
        'MultiDropdownPane MultiDropdownSearchPane',
        'flex flex-1 flex-col p-3 border-gray-300 border-l',
      )}>
      <Search onChange={setKeyword} keyword={keyword} id={`${id}.keyword`} />
      <Items
        {...getFloatingProps({
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
        })}
        activeIndex={activeIndex}
        aria-multiselectable="true"
        getItemProps={getItemProps}
        id={`${id}.search`}
        items={TypeaheadStore.search(keyword)}
        listRef={listRef}
        onChange={onChange}
        ref={refs.setFloating}
        values={values}
      />
    </div>
  )
}

type LargeMultiDropdownProps = {
  className: string,
  id: string,
  Item: any,
  label?: string,
  onChange: (values: object) => void,
  placeholder?: string,
  TypeaheadStore: any,
  values: object,
}

export const LargeMultiDropdown = (props: LargeMultiDropdownProps) => {
  const [expanded, setExpanded] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open: expanded,
    onOpenChange: setExpanded,
    middleware: commonMiddleware(),
  })
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useRole(context, {role: 'dialog'}),
    useClick(context),
    useDismiss(context),
  ])

  const onClose = useCallback(() => setExpanded(false), [])

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
            ref={refs.setFloating}
            className={clsx(
              `MultiDropdownPopover shadow`,
              'bg-white border border-gray-300 flex flex-row z-20',
            )}
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <ErrorBoundary>
              <MultiDropdownSelectedPane {...props} onClose={onClose} />
            </ErrorBoundary>
            <ErrorBoundary>
              <MultiDropdownSearchPane {...props} onClose={onClose} />
            </ErrorBoundary>
          </dialog>
        </FloatingFocusManager>
      </FloatingPortal>
    )
  }

  return (
    <>
      <MultiDropdownButton
        {...getReferenceProps()}
        className={props.className}
        id={props.id}
        placeholder={props.placeholder}
        ref={refs.setReference}
        values={props.values}
      />
      {expanded && Floating()}
    </>
  )
}
