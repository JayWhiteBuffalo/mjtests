import {BsFacebook, BsInstagram, BsTwitter} from 'react-icons/bs'
import {Logo, companyName, siteName} from '@/feature/shared/component/Site'
import Link from 'next/link'

export const FooterLinkGroup = ({title, children}) => (
  <div className="me-4 text-sm">
    <div className="font-semibold uppercase text-gray-500 dark:text-white">
      {title}
    </div>
    <ul className="mt-6 space-y-4 text-gray-500 dark:text-white">{children}</ul>
  </div>
)

export const FooterLink = ({href, children}) => (
  <li>
    <Link href={href}>{children}</Link>
  </li>
)

export const FooterNav = () => (
  <nav className="grid w-full justify-between px-6 py-8 gap-8 sm:flex sm:justify-between md:flex md:grid-cols-1 bg-lime-300">
    <Link href="/" className="flex flex-row self-start items-center mr-4">
      <Logo width={40} height={40} className="mr-1" />
      <div className="text-2xl text-gray-800 font-semibold dark:text-gray-white">
        {siteName}
      </div>
    </Link>

    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      <FooterLinkGroup title="About">
        <FooterLink href="/help/about">Treemap</FooterLink>
        <FooterLink href="/help">Help</FooterLink>
        <FooterLink href="/blog">Blog</FooterLink>
      </FooterLinkGroup>

      <FooterLinkGroup title="Follow us">
        <FooterLink href="#">Facebook</FooterLink>
        <FooterLink href="#">Instagram</FooterLink>
        <FooterLink href="https://twitter.com/mjtests">Twitter</FooterLink>
      </FooterLinkGroup>

      <FooterLinkGroup title="Legal">
        <FooterLink href="/help/privacy">Privacy Policy</FooterLink>
        <FooterLink href="/help/terms">Terms &amp; Conditions</FooterLink>
      </FooterLinkGroup>

      <FooterLinkGroup title="Business">
        <FooterLink href="/business#distributor">For Distributors</FooterLink>
        <FooterLink href="/business#producer">For Producers</FooterLink>
      </FooterLinkGroup>
    </div>
  </nav>
)

export const FooterCopyright = ({year = 2024}) => (
  <span className="text-sm">
    © {year} {companyName}
  </span>
)

export const FooterIcon = ({href, Icon}) => (
  <Link href={href}>
    <Icon className="w-5 h-5" />
  </Link>
)

export const FooterBar = () => (
  <div className="w-full p-6 sm:flex sm:items-center sm:justify-between text-gray-500 dark:text-gray-400 bg-lime-300">
    <FooterCopyright />
    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center ">
      <FooterIcon href="#" Icon={BsFacebook} />
      <FooterIcon href="#" Icon={BsInstagram} />
      <FooterIcon href="https://twitter.com/mjtests" Icon={BsTwitter} />
    </div>
  </div>
)

export const ShopFooter = () => (
  <footer className="w-full bg-lime-300">
    <FooterNav />
    <hr />
    <FooterBar />
  </footer>
)
