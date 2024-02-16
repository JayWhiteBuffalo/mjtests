import './MultiDropdown.css'
import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import FlagsUtil from '@util/FlagsUtil'
import FnUtil from '@util/FnUtil'
import ObjectUtil from '@util/ObjectUtil'
import {Button, Checkbox, TextInput} from 'flowbite-react'
import {CgSearch} from 'react-icons/cg'
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
      {...rest}
      className={clsx('MultiDropdown', className)}
      color="light"
      ref={ref}>
      <span className="MultiDropdownText">{text}</span>
      <HiOutlineChevronDown className="ml-2 h-4 w-4" />
    </Button>
  )
})
MultiDropdownButton.displayName = 'MultiDropdownButton'

const Items = forwardRef(({className, items, values, getItemProps, listRef, activeIndex, onChange, ...rest}, ref) =>
  <ul
    {...rest}
    className={clsx('MultiDropdownItems', className)}
    ref={ref}>
    {items.map((item, index) =>
      <li key={item.key}>
        <button
          {...getItemProps({
            onClick: () => onChange(FlagsUtil.toggle(values, item.key)),
          })}
          aria-selected={values[item.key] || false}
          className={clsx('MultiDropdownItem', values[item.key] && 'selected')}
          ref={node => listRef.current[index] = node}
          role="option"
          tabIndex={activeIndex === index ? 0 : -1}
          type="button">
          <Checkbox
            checked={values[item.key] || false}
            className="mr-1"
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
  <div className="MultiDropdownTopMenu">
    {items.length &&
      <div>
        <button
          className="MultiDropdownMenuButton"
          disabled={items.every(item => values[item.key])}
          onClick={() => onChange(FlagsUtil.fromIterable(items, x => x.key))}
          type="button">
          Select All
        </button>
        <button
          className="MultiDropdownMenuButton"
          disabled={ObjectUtil.isEmpty(values)}
          onClick={() => onChange({})}
          type="button">
          Clear Selection
        </button>
      </div>
    }
    <button
      className="MultiDropdownMenuButton MultiDropdownCloseButton"
      onClick={onClose}
      type="button">
      Done
    </button>
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
            className={`MultiDropdownPopover shadow small`}
            ref={refs.setFloating}
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <div className="MultiDropdownPane MultiDropdownItemsPane">
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
        values={props.values} />
      {expanded && Floating()}
    </>
  )
}

const Search = ({id, keyword, onChange}) =>
  <TextInput
    className="MultiDropdownKeyword"
    icon={CgSearch}
    id={id}
    onChange={e => onChange(e.target.value)}
    placeholder="Filter list"
    tabIndex={0}
    type="search"
    value={keyword}
    />

const MultiDropdownSelectedPane = ({id, values, TypeaheadStore, onChange, onClose}: MultiDropdownProps) => {
  const selectedItems = ArrayUtil.sortBy(Object.keys(values).map(TypeaheadStore.getByKey), x => x.name)

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
    <div className="MultiDropdownPane MultiDropdownSelectedPane">
      <div className="MultiDropdownTopMenu">
        <div>
          <span className="text-sm mr-4">Selected</span>
          <button
            className="MultiDropdownMenuButton"
            disabled={ObjectUtil.isEmpty(values)}
            onClick={() => onChange({})}
            type="button">
            Clear Selection
          </button>
        </div>
        <button
          className="MultiDropdownMenuButton MultiDropdownCloseButton"
          onClick={onClose}
          type="button">
          Done
        </button>
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
    <div className="MultiDropdownPane MultiDropdownSearchPane">
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
            className={`MultiDropdownPopover shadow large`}
            style={isMobile ? mobileFloatingStyles : floatingStyles}>
            <MultiDropdownSelectedPane {...props} onClose={onClose} />
            <MultiDropdownSearchPane {...props} onClose={onClose} />
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
        values={props.values} />
      {expanded && Floating()}
    </>
  )
}
