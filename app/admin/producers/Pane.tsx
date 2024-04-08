'use client'
import Link from 'next/link'
import {AuditingSection} from '@app/admin/components/AuditingSection'
import {BlueExternalLink} from '@components/Link'
import {Button} from 'flowbite-react'
import {Image} from '@components/Image'
import {None, Unknown, InfoSection} from '@components/InfoSection'
import {PhoneLink} from '@app/(shop)/components/VendorPopup'
import {AdminPane} from '@app/admin/components/Pane'

export const ProducerPane = ({producer, canEdit}) =>
  <AdminPane>
    <div className="flex justify-end gap-2">
      {
        canEdit
          ? <Link href={`/admin/producers/${producer.id}/edit`}>
              <Button>Edit</Button>
            </Link>
          : undefined
      }
    </div>

    <InfoSection>
      <header>
        <h2>General</h2>
      </header>
      <dl>
        <dt>Producer name</dt>
        <dd>{producer.name}</dd>

        <dt>Address</dt>
        {
          producer.location.address
            ? <dd className="!inline-block whitespace-pre-line">{producer.location.address}</dd>
            : <dd><None /></dd>
        }

        <dt>Flags</dt>
        <dd><code>{JSON.stringify(producer.flags)}</code></dd>

        <dt>Signup status</dt>
        <dd><code>{JSON.stringify(producer.signupStatus)}</code></dd>
      </dl>
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Contact</h2>
      </header>
      <dl>
        <dt>Phone</dt>
        <dd>{
          producer.contact.tel
            ? <PhoneLink tel={producer.contact.tel} />
            : <None />
        }</dd>

        <dt>Email</dt>
        <dd>{
          producer.contact.email
            ? <BlueExternalLink href={`mailto:${producer.contact.email}`}>{producer.contact.email}</BlueExternalLink>
            : <None />
        }</dd>

        <dt>Website</dt>
        <dd>{
          producer.contact.url
            ? <BlueExternalLink href={producer.contact.url}>producer.contact.url</BlueExternalLink>
            : <None />
        }</dd>
      </dl>
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Brand</h2>
      </header>
      {
        producer.mainImageRefId
          ? <>
            <p>Logo</p>
            <div className="w-24 h-18">
              <Image
                alt="Logo of producer"
                className="object-cover"
                fill={true}
                publicId={producer.mainImageRefId}
                />
            </div>
          </>
          : <dl>
            <dt>Logo</dt>
            <dd><None /></dd>
          </dl>
      }
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Legal</h2>
      </header>
      <dl>
        <dt>State of operation</dt>
        <dd>{producer.license.state}</dd>

        <dt>OMMA Dispensary License Number</dt>
        <dd>{producer.license.number ?? <Unknown />}</dd>
      </dl>
    </InfoSection>

    <AuditingSection record={producer} isAdmin={true} />
  </AdminPane>

