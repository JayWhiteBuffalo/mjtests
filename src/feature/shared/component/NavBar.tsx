import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem
  } from "@nextui-org/navbar";
import {Button, Link} from '@nextui-org/react'
// import Logo from '../../../public/icon.png'


  export const NavBar = () => {

    return (
        <Navbar
          classNames={{
            item: [
              "flex",
              "relative",
              "h-full",
              "items-center",
              "data-[active=true]:after:content-['']",
              "data-[active=true]:after:absolute",
              "data-[active=true]:after:bottom-0",
              "data-[active=true]:after:left-0",
              "data-[active=true]:after:right-0",
              "data-[active=true]:after:h-[2px]",
              "data-[active=true]:after:rounded-[2px]",
              "data-[active=true]:after:bg-primary",
            ],
          }}
        >
          <NavbarBrand>
            {/* <Logo /> */}
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
              <Link color="foreground" href="#">
                Pick a State
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Shop
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page">
                Contact Us
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Admin Panel
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="#">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="#" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
    )
  }
