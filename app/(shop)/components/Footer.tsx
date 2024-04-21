import {BsFacebook, BsInstagram, BsTwitter} from 'react-icons/bs'
import {Logo, companyName, siteName} from '@components/Site'
import Link from 'next/link'

export const FooterLinkGroup = ({title, children}) =>
  <div>
    <div>{title}</div>
    <ul>
      {children}
    </ul>
  </div>

export const FooterLink = ({href, children}) =>
  <li>
    <Link href={href}>
      {children}
    </Link>
  </li>

export const FooterNav = () =>
  <nav className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
    <div>
      <Logo width={200} height={200} />
      {siteName}
    </div>

    <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
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

export const FooterCopyright = ({year = 2024}) =>
  <span>© {year} {companyName}</span>

export const FooterIcon = ({href, Icon}) =>
  <Link href={href}>
    <Icon className="w-4 h-4" />
  </Link>

export const FooterBar = () =>
  <div className="w-full sm:flex sm:items-center sm:justify-between">
    <FooterCopyright />
    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
      <FooterIcon href="#" Icon={BsFacebook} />
      <FooterIcon href="#" Icon={BsInstagram} />
      <FooterIcon href="https://twitter.com/mjtests" Icon={BsTwitter} />
    </div>
  </div>

export const ShopFooter = () =>
  <div className="w-full">
    <FooterNav />
    <hr />
    <FooterBar />
  </div>
