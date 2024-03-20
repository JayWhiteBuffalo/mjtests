import {Footer} from 'flowbite-react'
import {BsFacebook, BsGithub, BsInstagram, BsTwitter} from 'react-icons/bs'

export const BusinessFooter = () =>
  <Footer container>
    <div className="w-full">
      <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
        <div>
          <Footer.Brand
            href="/"
            src="https://flowbite.com/docs/images/logo.svg"
            alt="Treemap Logo"
            name="Treemap"
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <Footer.Title title="About" />
            <Footer.LinkGroup col>
              <Footer.Link href="/help/about">Treemap</Footer.Link>
              <Footer.Link href="/help">Help</Footer.Link>
              <Footer.Link href="/blog">Blog</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Follow us" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Facebook</Footer.Link>
              <Footer.Link href="#">Instagram</Footer.Link>
              <Footer.Link href="#">Discord</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Legal" />
            <Footer.LinkGroup col>
              <Footer.Link href="/help/privacy">Privacy Policy</Footer.Link>
              <Footer.Link href="/help/terms">Terms &amp; Conditions</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Business" />
            <Footer.LinkGroup col>
              <Footer.Link href="/distributor">For Distributors</Footer.Link>
              <Footer.Link href="/producer">For Producers</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>

      <Footer.Divider />

      <div className="w-full sm:flex sm:items-center sm:justify-between">
        <Footer.Copyright href="#" by="Treemap" year={2024} />
        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
          <Footer.Icon href="#" icon={BsFacebook} />
          <Footer.Icon href="#" icon={BsInstagram} />
          <Footer.Icon href="#" icon={BsTwitter} />
          <Footer.Icon href="#" icon={BsGithub} />
        </div>
      </div>
    </div>
  </Footer>
