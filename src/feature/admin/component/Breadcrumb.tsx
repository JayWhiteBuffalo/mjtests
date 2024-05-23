import clsx from 'clsx'
import Link from 'next/link'
import {HiOutlineChevronRight} from 'react-icons/hi'

const Item = ({isFirst, href, label, Icon}) => {
  const cheveron = isFirst ? undefined : (
    <HiOutlineChevronRight aria-hidden className="text-gray-400 mx-1 h-4 w-4" />
  )
  const Inline = href ? Link : 'span'
  const inlineClassNames = href
    ? 'flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
    : 'flex items-center text-gray-500 dark:text-gray-400 font-bold'

  return (
    <li className="flex items-center">
      {cheveron}
      <Inline href={href} className={inlineClassNames}>
        {Icon && <Icon aria-hidden className="mr-1 h-4 w-4" />}
        {label}
      </Inline>
    </li>
  )
}

export const Breadcrumb = ({items, className, ...rest}) => {
  let path = ''
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('text-sm px-4 py-3', className)}
      {...rest}
    >
      <ol className="flex items-center">
        {items.map((item, index) => {
          path = path + '/' + item.segment
          return (
            <Item
              href={index === items.length - 1 ? undefined : path}
              Icon={item.Icon}
              isFirst={index === 0}
              key={index}
              label={item.name}
            />
          )
        })}
      </ol>
    </nav>
  )
}
