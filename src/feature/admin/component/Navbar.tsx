'use client'
import Link from 'next/link'
import {
  Avatar,
  Navbar,
  NavbarBrand,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@nextui-org/react'
import {HiMiniArrowRightOnRectangle} from 'react-icons/hi2'
import {Logo, siteName} from '@/feature/shared/component/Site'
import {signOut} from '@/feature/auth/serverAction/ServerAction'

export const AvatarDropdown = ({user}) => (
  <Dropdown>
    <DropdownTrigger>
      <Avatar
        as="button"
        className="transition-transform"
        isBordered
        src={user.profileImageUrl}
      />
    </DropdownTrigger>

    <DropdownMenu aria-label="Profile actions" variant="flat">
      <DropdownSection showDivider>
        <DropdownItem
          className="gap-2"
          isReadOnly
          textValue={`Signed in as ${user.name}`}
        >
          <p className="font-semibold">Signed in as</p>
          <p>{user.name}</p>
        </DropdownItem>
      </DropdownSection>

      <DropdownSection>
        <DropdownItem
          key="logout"
          startContent={
            <HiMiniArrowRightOnRectangle className="text-xl text-default-500" />
          }
          onPress={() => signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  </Dropdown>
)

export const AdminNavbar = ({user, ...rest}) => (
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
)
