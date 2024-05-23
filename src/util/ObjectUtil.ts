export type RecordTree<T> = T | Record<string, T | unknown>

const ObjectUtil = {
  getByPath(obj: Record<string, unknown>, path: string | string[]): unknown {
    if (typeof path === 'string') {
      path = path.split('.')
    }
    for (const x of path) {
      if (typeof obj === 'object' && obj[x] != null) {
        obj = obj[x] as Record<string, unknown>
      } else {
        return undefined
      }
    }
    return obj
  },

  map<
    XValue,
    YValue,
    XKey extends string | number = string,
    YKey extends string | number = string,
  >(
    xs: Record<XKey, XValue>,
    f: (xKey: XKey, xValue: XValue) => [YKey, YValue],
  ): Record<YKey, YValue> {
    const ys = {} as Record<YKey, YValue>
    for (const xKey in xs) {
      const [yKey, yValue] = f(xKey, xs[xKey])
      ys[yKey] = yValue
    }
    return ys
  },

  mapKey<
    Value,
    XKey extends string | number = string,
    YKey extends string | number = string,
  >(
    xs: Record<XKey, Value>,
    f: (xKey: XKey, xValue: Value) => YKey,
  ): Record<YKey, Value> {
    const ys = {} as Record<YKey, Value>
    for (const xKey in xs) {
      ys[f(xKey, xs[xKey])] = xs[xKey]
    }
    return ys
  },

  mapValue<XValue, YValue, Key extends string | number = string>(
    xs: Record<Key, XValue | undefined>,
    f: (xValue: XValue | undefined, xKey: Key) => YValue | undefined,
  ): Record<Key, YValue | undefined> {
    const ys = {} as Record<Key, YValue | undefined>
    for (const xKey in xs) {
      ys[xKey] = f(xs[xKey], xKey)
    }
    return ys
  },

  deepEquals(xs: unknown, ys: unknown): boolean {
    if (Object.is(xs, ys)) {
      return true
    }

    if (!(typeof xs === 'object' && typeof ys === 'object' && xs && ys)) {
      return false
    }

    for (const xKey in xs) {
      if (
        !(xKey in ys) ||
        !ObjectUtil.deepEquals(
          xs[xKey as keyof typeof xs],
          ys[xKey as keyof typeof ys],
        )
      ) {
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

  equals(xs: unknown, ys: unknown): boolean {
    if (Object.is(xs, ys)) {
      return true
    }

    if (!(typeof xs === 'object' && xs && typeof ys === 'object' && ys)) {
      return false
    }

    for (const xKey in xs) {
      if (
        !(xKey in ys) ||
        !Object.is(xs[xKey as keyof typeof xs], ys[xKey as keyof typeof ys])
      ) {
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

  isEmpty(xs: Record<string, unknown>): boolean {
    for (const _ in xs) {
      return false
    }
    return true
  },

  isNotEmpty(xs: Record<string, unknown>): boolean {
    for (const _ in xs) {
      return true
    }
    return false
  },

  size(xs: Record<string, unknown>): number {
    let count = 0
    for (const _ in xs) {
      count += 1
    }
    return count
  },

  delete<X>(xs: X, ...keys: (keyof X)[]): X {
    const ys = {...xs}
    for (const key of keys) {
      delete ys[key]
    }
    return ys
  },

  fromIterable<X, Key extends string | number>(
    xs: X[],
    getKey: (x: X) => Key,
  ): Record<Key, X> {
    const ys = {} as Record<Key, X>
    for (const x of xs) {
      ys[getKey(x)] = x
    }
    return ys
  },

  dfs: function* <X>(
    xs: RecordTree<X>,
    path: string[] = [],
  ): Generator<[RecordTree<X>, string[]]> {
    if (typeof xs === 'object' && xs) {
      yield [xs, path]

      for (const key in xs) {
        if (typeof xs[key as keyof typeof xs] === 'object') {
          yield* ObjectUtil.dfs(xs[key as keyof typeof xs] as RecordTree<X>, [
            ...path,
            key,
          ])
        }
      }
    }
  },

  deepClone<T extends object>(xs: T): T {
    const ys = {} as T
    for (const key in xs) {
      const xValue = xs[key]
      ys[key] =
        typeof xValue === 'object' && xValue
          ? ObjectUtil.deepClone(xValue)
          : xValue
    }
    return ys
  },

  defined(xs: Record<string, unknown>): Record<string, unknown> {
    const ys = {} as Record<string, unknown>
    for (const key in xs) {
      if (xs[key] !== undefined) {
        ys[key] = xs[key]
      }
    }
    return ys
  },

  deepMergeInto(
    xs: Record<string, unknown>,
    ys: Record<string, unknown>,
  ): Record<string, unknown> {
    for (const yKey in ys) {
      const xValue = xs[yKey]
      const yValue = ys[yKey]
      xs[yKey] =
        typeof xValue === 'object' && typeof yValue === 'object'
          ? ObjectUtil.deepMergeInto(
              xValue as Record<string, unknown>,
              yValue as Record<string, unknown>,
            )
          : yValue
    }
    return xs
  },

  deepDeleteWith(
    xs: Record<string, unknown>,
    ys: Record<string, unknown>,
  ): Record<string, unknown> {
    for (const yKey in ys) {
      const xValue = xs[yKey]
      const yValue = ys[yKey]
      if (typeof xValue === 'object' && typeof yValue === 'object') {
        ObjectUtil.deepDeleteWith(
          xValue as Record<string, unknown>,
          yValue as Record<string, unknown>,
        )
        if (ObjectUtil.isEmpty(xValue as Record<string, unknown>)) {
          delete xs[yKey]
        }
      } else {
        delete xs[yKey]
      }
    }
    return xs
  },

  filter(xs, pred) {
    const ys = {}
    for (const xKey in xs) {
      if (pred(xKey, xs[xKey])) {
        ys[xKey] = xs[xKey]
      }
    }
    return ys
  },
}

export default ObjectUtil
