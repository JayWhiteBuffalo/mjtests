import FnUtil from '@util/FnUtil'

const FlagsUtil = {
  toggle(xs, key) {
    const ys = {...xs}
    if (ys[key]) {
      delete ys[key]
    } else {
      ys[key] = true
    }
    return ys
  },

  setAll(xs, keys, value) {
    const ys = {...xs}
    for (const key of keys) {
      if (value) {
        ys[key] = true
      } else {
        delete ys[key]
      }
    }

    return ys
  },

  mutableSet(xs, key, value) {
    if (value) {
      xs[key] = true
    } else {
      delete xs[key]
    }
  },

  fromIterable(xs, getKey) {
    getKey = getKey || FnUtil.identity

    const ys = {}
    for (const x of xs) {
      ys[getKey(x)] = true
    }
    return ys
  },
}

export default FlagsUtil