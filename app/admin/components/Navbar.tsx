import Link from 'next/link'
import {Avatar, Navbar, NavbarBrand, Dropdown, DropdownItem, DropdownDivider, DropdownHeader} from 'flowbite-react'
import {FaBars} from 'react-icons/fa'
import {Logo, siteName} from '@components/Site'

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
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <Avatar alt="User settings" img={user.image} rounded />
        }
      >
        <DropdownHeader>
          <span className="block text-sm">{user.name}</span>
          <span className="block truncate text-sm font-medium">{user.email}</span>
        </DropdownHeader>
        <DropdownDivider />
        <DropdownItem>Sign out</DropdownItem>
      </Dropdown>
    </div>
  </Navbar>
