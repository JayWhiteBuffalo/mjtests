
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

  deepClone(xs) {
    const ys = {}
    for (const key in xs) {
      const xValue = xs[key]
      ys[key] = typeof xValue === 'object'
        ? ObjectUtil.deepClone(xValue)
        : xValue
    }
    return ys
  },

  deepMergeInto(xs, ys) {
    for (const yKey in ys) {
      const xValue = xs[yKey]
      const yValue = ys[yKey]
      xs[yKey] = typeof xValue === 'object' && typeof yValue === 'object'
        ? ObjectUtil.deepMergeInto(xValue, yValue)
        : yValue
    }
    return xs
  },

  deepDeleteWith(xs, ys) {
    for (const yKey in ys) {
      const xValue = xs[yKey]
      const yValue = ys[yKey]
      if (typeof xValue === 'object' && typeof yValue === 'object') {
        ObjectUtil.deepDeleteWith(xValue, yValue)
        if (ObjectUtil.isEmpty(xValue)) {
          delete xs[yKey]
        }
      } else {
        delete xs[yKey]
      }
    }
    return xs
  },
}

export default ObjectUtil