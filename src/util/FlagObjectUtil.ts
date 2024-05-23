import {identity} from '@util/FnUtil'

export type FlagObject<T = string> = Record<T, true>

// Utility module for objects whose values are `true`.
const FlagObjectUtil = {
  toggle(xs: FlagObject, key: string): FlagObject {
    const ys = {...xs}
    if (ys[key]) {
      delete ys[key]
    } else {
      ys[key] = true
    }
    return ys
  },

  setAll(xs: FlagObject, keys: string[], value: boolean): FlagObject {
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

  set(xs: FlagObject, key: string, value: boolean): FlagObject {
    return FlagObjectUtil.setAll(xs, [key], value)
  },

  mutableSet(xs: FlagObject, key: string, value: boolean): void {
    if (value) {
      xs[key] = true
    } else {
      delete xs[key]
    }
  },

  fromIterable<X>(
    xs: X[],
    getKey: (x: X) => string = identity as (x: X) => string,
  ): FlagObject {
    const ys = {} as FlagObject
    for (const x of xs) {
      ys[getKey(x)] = true
    }
    return ys
  },
}

export default FlagObjectUtil
