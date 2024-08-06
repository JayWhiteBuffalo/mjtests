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
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import {HiMiniArrowRightOnRectangle} from 'react-icons/hi2'
import {Logo, siteName} from '@/feature/shared/component/Site'
import {signOut} from '@/feature/auth/serverAction/ServerAction'
import {canUseRootPage, rootPages} from '@/feature/admin/util/RootPage'


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
      <div className="flex gap-4 items-center">
        <AvatarDropdown user={user} />
        <p>{user.name}</p>
      </div>
    </div>
  </Navbar>
)

export const MobileAdminNavbar = ({user, ...rest}) => {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const rootItems = rootPages.filter(page => canUseRootPage(user, page.key)).map(page => ({
    key: page.key,
    href: `/admin/${page.segment}`,
    name: page.name,
    Icon: page.Icon,
  }));

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
    { name: "Pick A State", href: "/location" },
    ...rootItems,
    { name: "Log Out", href: "/logout" }
  ];

  return(
  <Navbar onMenuOpenChange={setIsMenuOpen} className='bg-lime-300 ' height={'6rem'}>
  <NavbarContent>
    <NavbarBrand>
        <div className='logo'>
            <Link href="/" className="flex flex-row self-start items-center mr-4">
                <Logo width={60} height={60} className="mr-1" />
                <div className="text-2xl text-gray-800 font-semibold dark:text-gray-white">
                    {siteName}
                </div>
            </Link>
        </div>
    </NavbarBrand>
  </NavbarContent>
  <NavbarMenuToggle
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      className="sm:hidden"
    />

  <NavbarContent className="hidden sm:flex gap-4" justify="center">


    <NavbarItem>
      <Link color="foreground" href="/contact">
      Contact
      </Link>
    </NavbarItem>
    <NavbarItem isActive>
      <Link href="/location" >
        Pick a State
      </Link>
    </NavbarItem>
    <NavbarItem>
    {user.loggedIn ? (
                        <div className='flex gap-4'>                               
                         <AvatarDropdown user={user}/>
                         <span>{user.name}</span>
                        </div>
                    ) : (                
                        <a href='/auth'>
                            <button className='px-6 py-2 border-1 border-black rounded-xl'>Login</button>
                        </a>)
                }

    </NavbarItem>
  </NavbarContent>


  <NavbarMenu height={'6rem'}>
    {menuItems.map((item, index) => (
      <NavbarMenuItem key={`${item}-${index}`}>
        <Link
          color={
            index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
          }
          className="w-full"
          href="#"
          size="lg"
        >
          {item}
        </Link>
      </NavbarMenuItem>
    ))}
  </NavbarMenu>
  <div className="flex">
      <NavbarBrand href="/admin" as={Link}>
        <Logo className="mr-1 ml-2 h-10 w-10 sm:h-9" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {siteName} Management Console
        </span>
      </NavbarBrand>
    </div>
</Navbar>
);
}