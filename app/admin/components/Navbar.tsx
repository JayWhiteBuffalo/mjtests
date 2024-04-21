import Link from 'next/link'
import {Avatar, Navbar, NavbarBrand, Dropdown, DropdownItem, DropdownSection} from '@nextui-org/react'
import {FaBars} from 'react-icons/fa'
import {Logo, siteName} from '@components/Site'

export const AvatarDropdown = ({user}) =>
  <Dropdown>
    <DropdownTrigger>
      <Avatar alt="User settings" img={user.image} rounded />
    </DropdownTrigger>

    <DropdownMenu aria-label="Profile actions">
      <DropdownSection showDivider>
        <DropdownItem>
          <span className="block text-sm">{user.name}</span>
          <span className="block truncate text-sm font-medium">{user.email}</span>
        </DropdownItem>
      </DropdownSection>

      <DropdownSection showDivider>
        <DropdownItem>Sign out</DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  </Dropdown>

export const AdminNavbar = ({user, ...rest}) =>
  <Navbar fluid {...rest}>
    <div className="flex">
      {/*
      <button type="button">
        <FaBars className="h-6 w-6 shrink-0" />
      </button>
      */}
      <NavbarBrand href="/admin" as={Link}>
        <Logo className="mr-1 ml-2 h-10 w-10 sm:h-9" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {siteName} Management Console
        </span>
      </NavbarBrand>
    </div>

    <div className="flex md:order-2">
      <AvatarDropdown user={user} />
    </div>
  </Navbar>
