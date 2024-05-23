import {isIterable} from '@util/IteratorUtil'

const ArrayUtil = {
  sortBy<X, Metric>(xs: X[], f: (a: X) => Metric): X[] {
    return xs.toSorted((x, y) => ArrayUtil.valueCompare(f(x), f(y)))
  },

  sortInPlaceBy<X, Metric>(xs: readonly X[], f: (a: X) => Metric): X[] {
    return [...xs].sort((x, y) => ArrayUtil.valueCompare(f(x), f(y)))
  },
  equals<A>(xs: A[], ys: A[]): boolean {
    return xs.length === ys.length && xs.every((x, i) => x === ys[i])
  },

  lexicalCompare<A>(xs: A[], ys: A[]): number {
    for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
      const d = ArrayUtil.valueCompare(xs[i], ys[i])
      if (d !== 0) {
        return d
      }
    }

    return xs.length - ys.length
  },

  valueCompare(x: unknown, y: unknown): number {
    if (typeof x !== typeof y) {
      return ArrayUtil.valueCompare(typeof x, typeof y)
    } else if (typeof x === 'string') {
      return x < (y as string) ? -1 : x === y ? 0 : 1
    } else if (typeof x === 'number') {
      return x - (y as number)
    } else if (typeof x === 'boolean') {
      return +x - +(y as boolean)
    } else if (
      typeof x === 'object' &&
      x instanceof Array &&
      y instanceof Array
    ) {
      return ArrayUtil.lexicalCompare(x, y)
    } else if (x === y) {
      return 0
    } else {
      throw new Error('Invalid comparision')
    }
  },

  range(a: number, b: number): number[] {
    const xs = [] as number[]
    for (let x = a; x < b; x++) {
      xs.push(x)
    }
    return xs
  },

  distinct<X, Key = X>(xs: X[], getKey?: (x: X) => Key): X[] {
    const map = new Map() as Map<Key, true>
    const ys = [] as X[]
    for (const x of xs) {
      const key = getKey ? getKey(x) : (x as unknown as Key)
      if (!map.get(key)) {
        map.set(key, true)
        ys.push(x)
      }
    }
    return ys
  },

  async asyncFilter<X>(
    xs: X[],
    pred: (x: X) => Promise<boolean>,
  ): Promise<X[]> {
    const tests = await Promise.all(xs.map(x => pred(x)))
    return xs.filter((_, i) => tests[i])
  },

  // Filters out falsy elements
  compact<X>(xs: (X | null | undefined)[]): X[] {
    return xs.filter(x => !!x) as X[]
  },

  // Flattens a mix of iterables and non-iterables
  extend<X>(...xs: X[] | X[][]): X[] {
    const ys = [] as X[]
    for (const x of xs) {
      if (isIterable(x)) {
        for (const xItem of x as X[]) {
          ys.push(xItem)
        }
      } else {
        ys.push(x as X)
      }
    }
    return ys
  },

  compactExtend<X>(...xs: (X | X[] | null | undefined)[]): X[] {
    return ArrayUtil.compact(ArrayUtil.extend(...xs)) as X[]
  },
}

export default ArrayUtil
