const FnUtil = {
  identity: x => x,
  void: _ => void 0,

  memoize(f) {
    const map = new Map()
    return x => {
      if (!map.has(x)) {
        map.set(x, f(x))
      }
      return map.get(x)
    }
  },

  // Memoized variant of the Y combinator
  memoizeY(f) {
    let yf
    yf = FnUtil.memoize(x => f(x, yf))
    return yf
  },
}

export default FnUtil
