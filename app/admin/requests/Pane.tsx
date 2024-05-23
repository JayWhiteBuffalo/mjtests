'use client'
import clsx from 'clsx'
import {AuditingSection} from '@app/admin/components/AuditingSection'
import {BlueLink} from '@components/Link'
import {Button} from '@nextui-org/react'
import {None, InfoSection} from '@components/InfoSection'
import {AdminPane} from '@app/admin/components/Pane'

export const VendorSection = ({vendor}) => (
  <InfoSection>
    <header>
      <h2>Vendor</h2>
    </header>
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
)

export const ProducerSection = ({producer}) => (
  <InfoSection>
    <header>
      <h2>Producer</h2>
    </header>
    <dl>
      <dt>Producer name</dt>
      <dd>{producer.name}</dd>

      <dt>Address</dt>
      <dd className="whitespace-pre-line">{producer.address ?? <None />}</dd>
    </dl>
  </InfoSection>
)

export const RequestPane = ({request, canEdit, approve, reject}) => (
  <AdminPane>
    {canEdit ? (
      <div className="flex justify-end gap-2">
        <Button onPress={() => approve()}>Approve</Button>
        <Button onPress={() => reject()}>Reject</Button>
      </div>
    ) : undefined}

    <InfoSection>
      <header>
        <h2>General</h2>
      </header>
      <dl>
        <dt>Request ID</dt>
        <dd>
          <code>{request.id}</code>
        </dd>

        <dt>Request type</dt>
        <dd>
          {request.type === 'vendor'
            ? 'Vendor application'
            : 'Producer application'}
        </dd>

        <dt>Request status</dt>
        <dd className={clsx(request.status !== 'pending' && 'font-bold')}>
          {request.status}
        </dd>

        <dt>Requested by</dt>
        <dd>
          <BlueLink href={`/admin/users/${request.user.email}`}>
            {request.user.name} &lt;{request.user.email}&ge;
          </BlueLink>
        </dd>
      </dl>
    </InfoSection>

    {request.vendor ? <VendorSection vendor={request.vendor} /> : undefined}
    {request.producer ? (
      <ProducerSection producer={request.producer} />
    ) : undefined}

    <AuditingSection record={request} isAdmin={true} />
  </AdminPane>
)
