'use client'
import Link from 'next/link'
import supabase from '@api/supabaseBrowser'
import {Avatar, Navbar, NavbarBrand, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection} from '@nextui-org/react'
import {Logo, siteName} from '@components/Site'

export const AvatarDropdown = ({user}) =>
  <Dropdown>
    <DropdownTrigger>
      <Avatar src={user.profileImageUrl} />
    </DropdownTrigger>

    <DropdownMenu aria-label="Profile actions" variant="flat">
      <DropdownSection showDivider>
        <DropdownItem>
          <span className="block text-sm">{user.name}</span>
          {/*<span className="block truncate text-sm font-medium">{user.email}</span>*/}
        </DropdownItem>
      </DropdownSection>

      <DropdownSection showDivider>
        <DropdownItem
          key="logout"
          onPress={() => void supabase.auth.signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  </Dropdown>

export const AdminNavbar = ({user, ...rest}) =>
  <Navbar {...rest}>
    <div className="flex">
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
