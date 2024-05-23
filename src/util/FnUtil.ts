export const identity = <X>(x: X): X => x

export const voidFn = () => void 0

export const memoize = <X, Y>(f: (x: X) => Y): ((x: X) => Y) => {
  const map = new Map()
  return x => {
    if (!map.has(x)) {
      map.set(x, f(x))
    }
    return map.get(x)
  }
}

// Memoized variant of the Y combinator
export const memoizeY = <X, Y>(
  f: (x: X, yf: (x: X) => Y) => Y,
): ((x: X) => Y) => {
  const yf: (x: X) => Y = memoize(x => f(x, yf))
  return yf
}

export type OptionalCallable<A> = A | (() => A)

export const callOptionalCallable = <A>(a: OptionalCallable<A>) =>
  typeof a === 'function' ? (a as () => A)() : a
