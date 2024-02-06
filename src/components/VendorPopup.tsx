import './VendorPopup.css'
import ArrayUtil from '@util/ArrayUtil'
import DateUtil from '@util/DateUtil'
import {Fragment} from 'react'
import {HiExternalLink} from 'react-icons/hi'
import {MdPhone} from 'react-icons/md'
import {Rating, Spinner} from 'flowbite-react'
import {useFluxStore} from '@state/Flux'
import {VendorSchedule} from '@util/VendorSchedule'
import {VendorStore} from '@state/DataStore'

const formatPhone = phone => {
  if (phone.startsWith('+1')) {
    return `(${phone.substring(2, 5)}) ${phone.substring(5, 8)}-${phone.substring(8, 12)}`
  } else {
    return phone
  }
}

const VendorLocation = ({location}) => 
  <address className="VendorPopupLocation">
    {location.address 
      ? <div className="VendorPopupAddress">{location.address}</div> 
      : undefined
    }
    {location.phone
      ? <a href={`tel:${location.phone}`} className="VendorPopupPhone flex items-center text-cyan-600 hover:underline dark:text-cyan-500">
          <MdPhone className="mr-1" />{formatPhone(location.phone)}
        </a>
      : undefined
    }
  </address>


export const OpenStatus = ({status}) => {
  if (status.closingSoon) {
    return (
      <span className="ProductVendorOpenStatus">
        <span className="text-green-600">Open</span>
        &nbsp;•&nbsp;
        <span className="text-amber-600">Closing soon at {DateUtil.formatAmPm(status.closes)}</span>
      </span>
    )
  } else if (status.alwaysOpen) {
    return <span className="ProductVendorOpenStatus text-green-600">Open 24 hours</span>
  } else if (status.isOpen) {
    return (
      <span className="ProductVendorOpenStatus">
        <span className="text-green-600">Open</span>
        &nbsp;•&nbsp;
        <span>Closes at {DateUtil.formatAmPm(status.closes)}</span>
      </span>
    )
  } else if (status.opensNext) {
    return (
      <span className="ProductVendorOpenStatus">
        <span className="text-red-600">Closed</span>
        &nbsp;•&nbsp;
        <span>Opens at {DateUtil.formatAmPm(status.opensNext)}</span>
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

  const lines = VendorSchedule.getCurrentWeek(schedule).map(({day, daySchedule}, dayOfWeek) => {
    const namedDay = VendorSchedule.namedDays[VendorSchedule.getNamedDay(day)]

    return (
      <Fragment key={dayOfWeek}>
        <dt className={dayOfWeek === nowDayOfWeek ? 'today' : ''}>
          <time dateTime={day}>{VendorSchedule.daysOfWeek[dayOfWeek]}</time>
        </dt>
        <dd className={dayOfWeek === nowDayOfWeek ? 'today' : ''}>
          {VendorSchedule.formatDaySchedule(daySchedule)}
          {namedDay && namedDay.holiday ? ` (${namedDay.name})` : undefined}
        </dd>
      </Fragment>
    )
  })

  return (
    <>
      <div className="font-bold">Store Hours</div>
      <dl className="VendorHours">
        {lines}
      </dl>
    </>
  )
}

export const VendorRating = ({rating}) =>
  <Rating className="VendorRating">
    {ArrayUtil.range(1, 6).map(x =>
      <Rating.Star key={x} filled={rating.average >= x - 0.5 - 1e-10} />
    )}
    <p className="ml-2">{rating.average.toFixed(1)}/5 ({rating.count} reviews)</p>
  </Rating>

export const VendorWebsite = ({url}) =>
  <div>
    <a 
      href={url} 
      target="_blank" 
      rel="noreferrer" 
      className="text-cyan-600 hover:underline dark:text-cyan-500">
      Website
      <HiExternalLink className="inline-block w-4 h-4" style={{marginTop: -2}} />
    </a>
  </div>

const VendorPopupContent = ({vendor}) => {
  return (
    <div className="VendorPopupContent">
      <div className="VendorPopupName">{vendor.name}</div>
      {vendor.location ? <VendorLocation location={vendor.location} /> : undefined}
      {vendor.flags?.permanentlyClosed ? <div className="text-red-800 font-bold">Permanently Closed</div> : undefined}
      {vendor.rating ? <VendorRating rating={vendor.rating} /> : undefined}
      <OpenStatus status={vendor.openStatus} />
      {vendor.url ? <VendorWebsite url={vendor.url} /> : undefined}
      {VendorSchedule.hasSchedule(vendor.schedule) ? <VendorHours schedule={vendor.schedule} /> : undefined}
    </div>
  )
}

export const VendorPopupContentContainer = ({vendorName}) => {
  useFluxStore(VendorStore)
  return VendorStore.getByName(vendorName)
    .then(vendor => <VendorPopupContent vendor={vendor} />)
    .orElse(() => <Spinner />)
}
