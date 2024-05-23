import {Unknown, InfoSection} from '@/feature/shared/component/InfoSection'
import {UserLinkContainer} from './User'

export const AuditingFields = ({record, isAdmin}) => (
  <>
    {isAdmin ? (
      <>
        <dt>Record ID</dt>
        <dd>{record.id ? <code>{record.id}</code> : <Unknown />}</dd>
      </>
    ) : undefined}

    <dt>Last updated</dt>
    <dd>
      {record.updatedAt ? record.updatedAt.toString() : <Unknown />}
      &nbsp;by{' '}
      {record.updatedById ? (
        <UserLinkContainer userId={record.updatedById} />
      ) : (
        <Unknown />
      )}
    </dd>

    <dt>Created</dt>
    <dd>
      {record.createdAt ? record.createdAt.toString() : <Unknown />}
      &nbsp;by{' '}
      {record.createdById ? (
        <UserLinkContainer userId={record.createdById} />
      ) : (
        <Unknown />
      )}
    </dd>

    {isAdmin ? (
      <>
        <dt>Version</dt>
        <dd>{record.version ?? <Unknown />}</dd>
      </>
    ) : undefined}

    {record.archived ? (
      <>
        <dt>Archived</dt>
        <dd>True</dd>
      </>
    ) : undefined}
  </>
)

export const AuditingSection = ({record, isAdmin}) => (
  <InfoSection>
    <header>
      <h2>Auditing</h2>
    </header>
    <dl>
      <AuditingFields record={record} isAdmin={isAdmin} />
    </dl>
  </InfoSection>
)
