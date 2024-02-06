
const ObjectUtil = {
  getByPath(obj, path) {
    for (const x of path) {
      if (typeof obj === 'object' && obj[x] != null) {
        obj = obj[x]
      } else {
        return undefined
      }
    }
    return obj
  },

  map(xs, f) {
    const ys = {}
    for (const xKey in xs) {
      const [yKey, yValue] = f(xKey, xs[xKey])
      ys[yKey] = yValue
    }
    return ys
  },

  mapKey(xs, f) {
    const ys = {}
    for (const xKey in xs) {
      ys[f(xKey)] = xs[xKey]
    }
    return ys
  },

  deepEquals(xs, ys) {
    if (Object.is(xs, ys)) {
      return true
    }

    if (!(typeof xs === 'object' && typeof ys === 'object')) {
      return false
    }

    for (const xKey in xs) {
      if (!ObjectUtil.deepEquals(xs[xKey], ys[xKey])) {
        return false
      }
    }

    for (const yKey in ys) {
      if (!(yKey in xs)) {
        return false
      }
    }

    return true
  },

  equals(xs, ys) {
    for (const xKey in xs) {
      if (!Object.is(xs[xKey], ys[xKey])) {
        return false
      }
    }

    for (const yKey in ys) {
      if (!(yKey in xs)) {
        return false
      }
    }

    return true
  },

  isEmpty(xs) {
    for (const _ in xs) {
      return false
    }
    return true
  },

  isNotEmpty(xs) {
    for (const _ in xs) {
      return true
    }
    return false
  },

  size(xs) {
    let count = 0
    for (const _ in xs) {
      count += 1
    }
    return count
  },

  delete(xs, key) {
    const ys = {...xs}
    delete ys[key]
    return ys
  },

  fromIterable(xs, getKey) {
    const ys = {}
    for (const x of xs) {
      ys[getKey(x)] = x
    }
    return ys
  },

  fromEntries(entries) {
    const xs = {}
    for (const [k, v] of entries) {
      xs[k] = v
    }
    return xs
  },
}

export default ObjectUtil