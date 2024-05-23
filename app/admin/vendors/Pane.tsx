'use client'
import Link from 'next/link'
import {AuditingSection} from '@app/admin/components/AuditingSection'
import {BlueExternalLink} from '@components/Link'
import {Button} from '@nextui-org/react'
import {None, Unknown, InfoSection} from '@components/InfoSection'
import {PhoneLink, VendorPopupContent} from '@app/(shop)/components/VendorPopup'
import {VendorUtil} from '@util/VendorUtil'
import {AdminPane} from '@app/admin/components/Pane'

export const VendorPane = ({vendor, canEdit}) => (
  <AdminPane>
    <div className="flex justify-end gap-2">
      {canEdit ? (
        <Link href={`/admin/vendors/${vendor.id}/edit`}>
          <Button>Edit</Button>
        </Link>
      ) : undefined}
    </div>

    <InfoSection>
      <header>
        <h2>General</h2>
      </header>
      <dl>
        <dt>Store name</dt>
        <dd>{vendor.name}</dd>

        <dt>Address</dt>
        {vendor.location.address ? (
          <dd className="!inline-block whitespace-pre-line">
            {vendor.location.address}
          </dd>
        ) : (
          <dd>
            <None />
          </dd>
        )}

        <dt>Flags</dt>
        <dd>
          <code>{JSON.stringify(vendor.flags)}</code>
        </dd>

        <dt>Rating</dt>
        <dd>
          <code>{JSON.stringify(vendor.rating)}</code>
        </dd>

        <dt className="hidden">Slug</dt>
        <dd className="hidden">
          <code>{vendor.slug}</code>
        </dd>

        <dt>Signup status</dt>
        <dd>
          <code>{JSON.stringify(vendor.signupStatus)}</code>
        </dd>
      </dl>
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Contact &amp; Socials</h2>
      </header>
      <dl>
        <dt>Phone</dt>
        <dd>
          {vendor.contact.tel ? (
            <PhoneLink tel={vendor.contact.tel} />
          ) : (
            <None />
          )}
        </dd>

        <dt>Email</dt>
        <dd>
          {vendor.contact.email ? (
            <BlueExternalLink href={`mailto:${vendor.contact.email}`}>
              {vendor.contact.email}
            </BlueExternalLink>
          ) : (
            <None />
          )}
        </dd>

        <dt>Website</dt>
        <dd>
          {vendor.contact.url ? (
            <BlueExternalLink href={vendor.contact.url}>
              vendor.contact.url
            </BlueExternalLink>
          ) : (
            <None />
          )}
        </dd>

        {vendor.contact.twitter ? (
          <>
            <dt>X/Twitter</dt>
            <dd>
              <BlueExternalLink
                href={`https://twitter.com/${vendor.contact.twitter}`}
              />
            </dd>
          </>
        ) : undefined}

        {vendor.contact.facebook ? (
          <>
            <dt>Facebook</dt>
            <dd>
              <BlueExternalLink href={vendor.contact.facebook} />
            </dd>
          </>
        ) : undefined}

        {vendor.contact.instagram ? (
          <>
            <dt>Instagram</dt>
            <dd>
              <BlueExternalLink
                href={`https://instagram.com/${vendor.contact.instagram}`}
              />
            </dd>
          </>
        ) : undefined}
      </dl>
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Legal</h2>
      </header>
      <dl>
        <dt>State of operation</dt>
        <dd>{vendor.license.state}</dd>

        <dt>OMMA Dispensary License Number</dt>
        <dd>{vendor.license.number ?? <Unknown />}</dd>
      </dl>
    </InfoSection>

    <AuditingSection record={vendor} isAdmin={true} />

    <InfoSection>
      <header>
        <h2>Preview</h2>
      </header>
      <PreviewContainer vendor={vendor} />
    </InfoSection>
  </AdminPane>
)

export const PreviewContainer = ({vendor}) => (
  <div className="flex gap-4 flex-wrap items-center">
    <div className="bg-white rounded-xl p-2 shadow">
      <VendorPopupContent vendor={VendorUtil.populate(vendor)} />
    </div>
  </div>
)
