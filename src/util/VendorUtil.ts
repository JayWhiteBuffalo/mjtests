import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import StringUtil from '@util/StringUtil'
import {OpenLocationCode} from 'open-location-code'
import {VendorSchedule} from '@util/VendorSchedule'

const geocoder = new OpenLocationCode()

export const VendorUtil = {
  read(vendor) {
    vendor.contact ??= {}
    vendor.flags ??= {}
    vendor.location ??= {}
    vendor.license ??= {}
    vendor.license.state ??= 'Oklahoma'
    vendor.signupStatus ??= {}
    vendor.slug ??= vendor.name ? VendorUtil.autoSlug(vendor) : null
    vendor.operatingStatus ??= 'open'

    vendor.schedule = VendorSchedule.readSchedule(vendor.schedule ?? {})

    if (vendor.rating) {
      VendorUtil.readRating(vendor.rating)
    }

    if (vendor.location?.plus) {
      const plusCode = '8674' + vendor.location.plus.match(/^[\w+]+/)[0]
      const decoded = geocoder.decode(plusCode)
      vendor.latLng = [decoded.latitudeCenter, decoded.longitudeCenter]
      vendor.location._latLng = vendor.latLng
    }
    return vendor
  },

  readRating(rating) {
    rating.count = rating.count || MathUtil.sum(rating.counts)
    rating.average = rating.average
      || MathUtil.dot(ArrayUtil.range(1, 6), rating.counts) / rating.count
  },

  autoSlug(vendor) {
    const words = StringUtil.wordsFromSpaced(vendor.name)
    return StringUtil.wordsToKebab(words).substring(0, 48)
  },

  populate(vendor) {
    vendor.key = vendor.name
    vendor.openStatus = VendorSchedule.getStatus(vendor.schedule)
    vendor.latLng ??= vendor.location._latLng
    return vendor
  },

  populateDistance(vendor, center) {
    vendor.distance = vendor.latLng
      ? MathUtil.earthDistance(vendor.latLng, center)
      : undefined
  },

  ommaNumberPattern: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,

  parsePartialOmmaNumber(x) {
    x = x.replace(/[^\w]/g, '')
    return [x.substring(0, 4), x.substring(4, 8), x.substring(8)]
      .filter(segment => segment !== '')
      .join('-')
      .toUpperCase()
  },
}
