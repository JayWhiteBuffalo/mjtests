import {z} from 'zod'

export const orEmpty = x => x != null ? String(x) : ''

export const unempty = x => {
  x = x?.trim()
  return x !== '' ? x : undefined
}

export const unemptied = schema => z.preprocess(unempty, schema)

export const orNan = x => x ?? NaN

export const unNan = x => {
  x = Number.parseFloat(x)
  return !Number.isNaN(x) ? x : undefined
}

export const orNull = x => x != null ? x : null

export const mapDefined = (x, f) => x != null ? f(x) : x
