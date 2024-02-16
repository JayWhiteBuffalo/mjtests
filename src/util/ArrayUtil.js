
const ArrayUtil = {
  sortBy(xs, f) {
    return xs.toSorted((x, y) => ArrayUtil.valueCompare(f(x), f(y)))
  },

  sortInPlaceBy(xs, f) {
    return xs.sort((x, y) => ArrayUtil.valueCompare(f(x), f(y)))
  },

  equals(xs, ys) {
    return xs.length === ys.length
      && xs.every((x, i) => x === ys[i])
  },

  lexicalCompare(xs, ys) {
    for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
      const d = ArrayUtil.valueCompare(xs[i], ys[i])
      if (d !== 0) {
        return d
      }
    }

    return xs.length - ys.length
  },

  valueCompare(x, y) {
    if (typeof x !== typeof y) {
      return ArrayUtil.valueCompare(typeof x, typeof y)
    } else if (typeof x === 'string') {
      return x < y ? -1 : x === y ? 0 : 1
    } else if (typeof x === 'number') {
      return x - y
    } else if (typeof x === 'object' && x instanceof Array) {
      return ArrayUtil.lexicalCompare(x, y)
    } else if (x === y) {
      return 0
    } else {
      throw new Error('Invalid comparision')
    }
  },

  range(a, b) {
    const xs = []
    for (let x = a; x < b; x++) {
      xs.push(x)
    }
    return xs
  },

  distinct(xs, f) {
    const map = new Map()
    const ys = []
    for (const x of xs) {
      const key = f ? f(x) : x
      if (!map.get(key)) {
        map.set(key, true)
        ys.push(x)
      }
    }
    return ys
  },

  splice(xs, start, deleteCount, ...items) {
    return [...xs.slice(0, start), ...items, ...xs.slice(start + deleteCount)]
  },

  async asyncFilter(xs, pred) {
    const tests = await Promise.all(xs.map(x => pred(x)))
    return xs.filter((_, i) => tests[i])
  },
}

export default ArrayUtil