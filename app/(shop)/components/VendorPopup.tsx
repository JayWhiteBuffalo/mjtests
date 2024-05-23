import DateUtil from '@util/DateUtil'
import {BlueExternalLink} from '@components/Link'
import {Fragment} from 'react'
import {MdPhone} from 'react-icons/md'
import {Rating} from '@mantine/core'
import {Spinner} from '@nextui-org/react'
import {useFluxStore} from '@/state/Flux'
import {VendorSchedule} from '@util/VendorSchedule'
import {VendorStore} from '../state/DataStore'

const VendorLocation = ({location}) => (
  <address className="VendorPopupLocation">
    {location.address ? (
      <div className="whitespace-pre-line">{location.address}</div>
    ) : undefined}
  </address>
)

const VendorOperatingStatus = ({status}) => {
  if (status === 'permanentlyClosed') {
    return <div className="text-red-800 font-bold">Permanently Closed</div>
  } else if (status === 'temporarilyClosed') {
    return <div className="text-red-800 font-bold">Temporarily Closed</div>
  } else {
    return undefined
  }
}
const formatPhone = tel => {
  if (tel.startsWith('+1')) {
    return `(${tel.substring(2, 5)}) ${tel.substring(5, 8)}-${tel.substring(8, 12)}`
  } else {
    return tel
  }
}

export const VendorWebsite = ({url}) => (
  <div>
    <BlueExternalLink href={url}>Website</BlueExternalLink>
  </div>
)

export const PhoneLink = ({tel}) => (
  <BlueExternalLink
    href={`tel:${tel}`}
    newTab={false}
    className="VendorPopupPhone inline-flex items-center"
  >
    <MdPhone className="mr-1" />
    {formatPhone(tel)}
  </BlueExternalLink>
)

const VendorContact = ({contact}) => (
  <div className="flex justify-between">
    {contact.url ? <VendorWebsite url={contact.url} /> : undefined}
    {contact.tel ? <PhoneLink tel={contact.tel} /> : undefined}
  </div>
)

export const OpenStatus = ({status}) => {
  if (status.closingSoon) {
    return (
      <span className="ProductVendorOpenStatus">
        <span className="text-green-600">Open</span>
        &nbsp;•&nbsp;
        <span className="text-amber-600">
          Closing soon at {DateUtil.formatShortAmPm(status.closes)}
        </span>
      </span>
    )
  } else if (status.alwaysOpen) {
    return (
      <span className="ProductVendorOpenStatus text-green-600">
        Open 24 hours
      </span>
    )
  } else if (status.isOpen) {
    return (
      <span className="ProductVendorOpenStatus">
        <span className="text-green-600">Open</span>
        &nbsp;•&nbsp;
        <span>Closes at {DateUtil.formatShortAmPm(status.closes)}</span>
      </span>
    )
  } else if (status.opensNext) {
    return (
      <span className="ProductVendorOpenStatus">
        <span className="text-red-600">Closed</span>
        &nbsp;•&nbsp;
        <span>Opens at {DateUtil.formatShortAmPm(status.opensNext)}</span>
      </span>
    )
  } else if (status.isOpen === false) {
    return <span className="ProductVendorOpenStatus text-red-600">Closed</span>
  } else {
    return undefined
  }
}

const VendorHours = ({schedule}) => {
  const nowDayOfWeek = new Date().getDay()

  const lines = VendorSchedule.getCurrentWeek(schedule).map(
    ({day, daySchedule}, dayOfWeek) => {
      const namedDay = VendorSchedule.namedDays[VendorSchedule.getNamedDay(day)]

      return (
        <Fragment key={dayOfWeek}>
          <dt className={dayOfWeek === nowDayOfWeek ? 'font-bold' : ''}>
            <time dateTime={day}>
              {VendorSchedule.daysOfWeek[dayOfWeek].name}
            </time>
          </dt>
          <dd className={dayOfWeek === nowDayOfWeek ? 'font-bold' : ''}>
            {VendorSchedule.formatDaySchedule(daySchedule)}
            {namedDay && namedDay.holiday ? ` (${namedDay.name})` : undefined}
          </dd>
        </Fragment>
      )
    },
  )

  return (
    <>
      <div className="font-bold">Store Hours</div>
      <dl
        className="grid mb-1 leading-tight"
        style={{
          gridTemplateColumns: '100px 1fr',
        }}
      >
        {lines}
      </dl>
    </>
  )
}

export const VendorRating = ({rating}) => (
  <div className="flex items-center">
    <Rating value={rating.average} fractions={10} readOnly />
    <p className="ml-2">
      {rating.average.toFixed(1)}/5 ({rating.count} reviews)
    </p>
  </div>
)

export const VendorPopupContent = ({vendor}) => {
  return (
    <div className="text-left text-sm">
      <div className="text-base font-bold">{vendor.name}</div>
      {vendor.location ? (
        <VendorLocation location={vendor.location} />
      ) : undefined}
      <VendorOperatingStatus status={vendor.operatingStatus} />
      {vendor.openStatus ? (
        <OpenStatus status={vendor.openStatus} />
      ) : undefined}
      {vendor.contact ? <VendorContact contact={vendor.contact} /> : undefined}
      {vendor.rating ? <VendorRating rating={vendor.rating} /> : undefined}
      {VendorSchedule.hasSchedule(vendor.schedule) ? (
        <VendorHours schedule={vendor.schedule} />
      ) : undefined}
    </div>
  )
}

export const VendorPopupContentContainer = ({vendorId}) => {
  useFluxStore(VendorStore)
  return VendorStore.getPresentById(vendorId)
    .then(vendor => <VendorPopupContent vendor={vendor} />)
    .orElse(() => <Spinner />)
}
