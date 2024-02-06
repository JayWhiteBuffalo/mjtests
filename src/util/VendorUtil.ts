import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import {OpenLocationCode} from 'open-location-code'
import {VendorSchedule} from '@util/VendorSchedule'

const geocoder = new OpenLocationCode()

export const VendorUtil = {
  read(vendor) {
    vendor.flags = vendor.flags || {}

    vendor.schedule = vendor.schedule || {}
    vendor.schedule.all = vendor.schedule.all || 'unknown'
    for (const key in vendor.schedule) {
      vendor.schedule[key] = VendorSchedule.parseDaySchedule(vendor.schedule[key])
    }

    if (vendor.rating) {
      VendorUtil.readRating(vendor.rating)
    }

    if (vendor.location?.plus) {
      const plusCode = '8674' + vendor.location.plus.match(/^[\w+]+/)[0]
      const decoded = geocoder.decode(plusCode)
      vendor.latLng = [decoded.latitudeCenter, decoded.longitudeCenter]
      vendor.location._latLng = vendor.latLng
    }
  },

  readRating(rating) {
    rating.count = rating.count || MathUtil.sum(rating.counts)
    rating.average = rating.average
      || MathUtil.dot(ArrayUtil.range(1, 6), rating.counts) / rating.count
  },

  populate(vendor) {
    vendor.key = vendor.name
    vendor.openStatus = VendorSchedule.getStatus(vendor.schedule)
    vendor.latLng = vendor.location._latLng
  },
}
