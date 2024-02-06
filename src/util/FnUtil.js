export default {
  identity: x => x,

  memoize(f) {
    const map = new Map()
    return x => {
      if (!map.has(x)) {
        map.set(x, f(x))
      }
      return map.get(x)
    }
  },
}
