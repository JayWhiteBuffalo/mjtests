
const ObjectUtil = {
  getByPath(obj, path) {
    if (typeof path === 'string') {
      path = path.split('.')
    }
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
      ys[f(xKey, xs[xKey])] = xs[xKey]
    }
    return ys
  },

  mapValue(xs, f) {
    const ys = {}
    for (const xKey in xs) {
      ys[xKey] = f(xs[xKey], xKey)
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
      if (!(xKey in ys) || !ObjectUtil.deepEquals(xs[xKey], ys[xKey])) {
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
    if (Object.is(xs, ys)) {
      return true
    }

    if (!(typeof xs === 'object' && typeof ys === 'object')) {
      return false
    }

    for (const xKey in xs) {
      if (!(xKey in ys) || !Object.is(xs[xKey], ys[xKey])) {
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

  delete(xs, ...keys) {
    const ys = {...xs}
    for (const key of keys) {
      delete ys[key]
    }
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

  dfs: function*(xs, path = []) {
    if (typeof xs === 'object') {
      yield [xs, path]

      for (const key in xs) {
        if (typeof xs[key] === 'object') {
          yield* ObjectUtil.dfs(xs[key], [...path, key])
        }
      }
    }
  },
}

export default ObjectUtil