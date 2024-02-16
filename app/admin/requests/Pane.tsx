'use client'
import clsx from 'clsx'
import {BlueLink} from '@components/Link'
import {Button} from 'flowbite-react'
import {None, InfoSection, AuditingSection} from '@app/admin/components/InfoSection'

export const VendorSection = ({vendor}) =>
  <InfoSection>
    <h2>Vendor</h2>
    <dl>
      <dt>Store name</dt>
      <dd>{vendor.name}</dd>

      <dt>Email</dt>
      <dd>{vendor.email ?? <None />}</dd>

      <dt>Website</dt>
      <dd>{vendor.url ?? <None />}</dd>

      <dt>Address</dt>
      <dd className="whitespace-pre-line">{vendor.address ?? <None />}</dd>
    </dl>
  </InfoSection>

export const ProducerSection = ({producer}) =>
  <InfoSection>
    <h2>Producer</h2>
    <dl>
      <dt>Producer name</dt>
      <dd>{producer.name}</dd>

      <dt>Address</dt>
      <dd className="whitespace-pre-line">{producer.address ?? <None />}</dd>
    </dl>
  </InfoSection>

export const RequestPane = ({request, canEdit, approve, reject}) =>
  <div className="AdminPane">

    {
      canEdit
        ? <div className="flex justify-end gap-2">
            <Button onClick={() => approve()}>Approve</Button>
            <Button onClick={() => reject()}>Reject</Button>
          </div>
        : undefined
    }

    <InfoSection>
      <header>
        <h2>General</h2>
      </header>
      <dl>
        <dt>Request ID</dt>
        <dd><code>{request.id}</code></dd>

        <dt>Request type</dt>
        <dd>{request.type === 'vendor' ? 'Vendor application' : 'Producer application'}</dd>

        <dt>Request status</dt>
        <dd className={clsx(request.status !== 'pending' && 'font-bold')}>{request.status}</dd>

        <dt>Requested by</dt>
        <dd>
          <BlueLink href={`/admin/users/${request.user.email}`}>
            {request.user.name} &lt;{request.user.email}&ge;
          </BlueLink>
        </dd>
      </dl>
    </InfoSection>

    {request.vendor ? <VendorSection vendor={request.vendor} /> : undefined}
    {request.producer ? <ProducerSection producer={request.producer} /> : undefined}

    <AuditingSection record={request} isAdmin={true} />
  </div>
