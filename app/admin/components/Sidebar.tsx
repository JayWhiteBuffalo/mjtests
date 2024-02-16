import Link from 'next/link'
import {homePage, rootPages, canUseRootPage} from '@app/admin/RootPage'

const Item = ({children, href, Icon}) =>
  <li className="AdminSidebarItem">
    <Link href={href} className="rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
      <Icon className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
      <span className="px-3 flex-1 whitespace-nowrap">{children}</span>
    </Link>
  </li>

export const AdminSidebar = ({user}) =>
  <nav aria-label="Sidebar navigation" className="AdminSidebar bg-gray-50 dark:bg-gray-800">
    <ul className="AdminSidebarList">
      <Item href="/admin" Icon={homePage.Icon}>
        {homePage.name}
      </Item>
      {rootPages.map(page =>
        canUseRootPage(user, page.key)
          ? <Item key={page.key} href={`/admin/${page.segment}`} Icon={page.Icon}>
              {page.name}
            </Item>
          : undefined
      )}
    </ul>
  </nav>
