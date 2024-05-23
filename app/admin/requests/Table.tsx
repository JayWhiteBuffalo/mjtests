'use client'
import {BlueLink} from '@components/Link'
import {TMTable, makeColumns} from '@components/Table'

const reprRequestType = type => {
  if (type === 'vendor') {
    return 'Vendor application'
  } else if (type === 'producer') {
    return 'Producer application'
  } else {
    return 'Unknown'
  }
}

const TypeCell = ({item: request}) => reprRequestType(request.type)

const NameCell = ({item: request}) => (
  <BlueLink href={`/admin/requests/${request.id}`} className="py-4">
    {request.vendor?.name ?? request.producer?.name}
  </BlueLink>
)

const LocationCell = ({item: request}) => (
  <div className="whitespace-pre-line">
    {request.vendor?.address ?? request.producer?.address}
  </div>
)

const LicenseCell = ({item: request}) => (
  <>
    <div>{request.vendor?.licenseState ?? request.producer?.licenseState}</div>
    <div className="whitespace-pre-line">
      {request.vendor?.licenseNumber ?? request.producer?.licenseNumber}
    </div>
  </>
)

export const RequestTable = ({requests}) => {
  const columns = makeColumns([
    {key: 'type', label: 'Type', Cell: TypeCell},
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'address', label: 'Location', Cell: LocationCell},
    {key: 'license', label: 'License #', Cell: LicenseCell},
  ])

  return (
    <TMTable
      aria-label="Table of business requests"
      columns={columns}
      items={requests}
    />
  )
}
