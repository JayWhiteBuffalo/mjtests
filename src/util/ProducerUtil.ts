import MathUtil from '@/util/MathUtil';
import {VendorSchedule} from '@/util/VendorSchedule'

export const ProducerUtil = {
  read(producer) {
    producer.contact ??= {};
    producer.flags ??= {};
    producer.location ??= {};
    producer.license ??= {};
    producer.license.state ??= 'Oklahoma';
    producer.signupStatus ??= {};
    producer.slug ??= producer.name ? VendorUtil.autoSlug(producer) : null;
    producer.operatingStatus ??= 'open';

    if (producer.location?.plus) {
      const plusCode = '8674' + producer.location.plus.match(/^[\w+]+/)[0];
      const decoded = geocoder.decode(plusCode);
      producer.latLng = [decoded.latitudeCenter, decoded.longitudeCenter];
      producer.location._latLng = producer.latLng;
    }
    return producer;
  },

  populate(producer) {
    producer.key = producer.name;
    producer.latLng ??= producer.location._latLng;
    if(producer.vendor){
    producer.vendor.openStatus = VendorSchedule.getStatus(producer.vendor.schedule)
    }
    return producer;
  },

  populateDistance(producer, center) {
    producer.distance = producer.latLng
      ? MathUtil.earthDistance(producer.latLng, center)
      : undefined;
  },
};
