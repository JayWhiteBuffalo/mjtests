export default {
  orNan: (x: number | null | undefined): number => x ?? NaN,

  unnan: (x: number): number | undefined => (!Number.isNaN(x) ? x : undefined),

  sum(xs: number[]): number {
    return xs.reduce((x, y) => x + y, 0)
  },

  roundTo(x: number, precision: number): number {
    const power = Math.pow(10, precision)
    return Math.round(x * power) / power
  },

  divide(x, y) {
    let rem = x % y
    if (rem < 0) {
      rem += Math.abs(y)
    }
    return [(x - rem) / y, rem]
  },

  inRange(range, x) {
    return (
      (range[0] === undefined || range[0] <= x) &&
      (range[1] === undefined || x <= range[1])
    )
  },

  mapRange(range, f) {
    return range.map(x => (x !== undefined ? f(x) : x))
  },

  dot(xs, ys) {
    let x = 0
    for (let i = 0; i < xs.length; i++) {
      x += xs[i] * ys[i]
    }
    return x
  },

  // A simple linear congruential generator with 16-bit state and 8-bit output.
  lcg8: function* (seed) {
    const iter = state => (25385 * state + 1) % 0x10000
    let state = iter(seed != null ? seed % 0x10000 : 0)
    while (true) {
      state = iter(state)
      yield state >> 8
    }
  },

  // from leaflet's Earth.distanceTo
  // distance between two geographical points using spherical law of cosines approximation
  earthDistance(latlng1, latlng2) {
    // Mean Earth Radius, as recommended for use by
    // the International Union of Geodesy and Geophysics,
    // see https://rosettacode.org/wiki/Haversine_formula
    const R = 6371000
    const rad = Math.PI / 180,
      lat1 = latlng1[0] * rad,
      lat2 = latlng2[0] * rad,
      sinDLat = Math.sin(((latlng2[0] - latlng1[0]) * rad) / 2),
      sinDLon = Math.sin(((latlng2[1] - latlng1[1]) * rad) / 2),
      a =
        sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },
}
