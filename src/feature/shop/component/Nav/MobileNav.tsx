import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link as NextUILink, Button } from "@nextui-org/react";
import Link from 'next/link';
import { siteName } from '@/feature/shared/component/Site';
import { Logo } from '@/feature/shared/component/Site';
import { AvatarDropdown } from '@/feature/admin/component/Navbar';
import './Header.css';

export default function MobileNav({ user }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
    { name: "Pick A State", href: "/location" },
    { name: "Admin Panel", href: "/admin" },
    { name: "Log Out", href: "/logout" }
  ];

  return (
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen} className='bg-lime-300' height={'6rem'}>
      <NavbarContent>
        <NavbarBrand>
          <div className='logo'>
            <Link href="/" passHref>
              <NextUILink className="flex flex-row self-start items-center mr-4">
                <Logo width={60} height={60} className="mr-1" />
                <div className="text-2xl text-gray-800 font-semibold dark:text-gray-white">
                  {siteName}
                </div>
              </NextUILink>
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
          <Link href="/contact" passHref>
            <NextUILink color="foreground">Contact</NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/location" passHref>
            <NextUILink>Pick a State</NextUILink>
          </Link>
        </NavbarItem>
        <NavbarItem>
          {user.loggedIn ? (
            <div className='flex gap-4'>
              <AvatarDropdown user={user} />
              <span>{user.name}</span>
            </div>
          ) : (
            <Link href='/auth' passHref>
              <NextUILink>
                <button className='px-6 py-2 border-1 border-black rounded-xl'>Login</button>
              </NextUILink>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu height={'6rem'}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link href={item.href} passHref>
              <NextUILink
                color={
                  index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                }
                className="w-full"
                size="lg"
              >
                {item.name}
              </NextUILink>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
