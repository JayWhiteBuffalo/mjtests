import MathUtil from '@/util/MathUtil'
import StringUtil from '@/util/StringUtil'
import {z, type ZodType} from 'zod'

export const orNan = <X extends NonNullable<unknown>>(
  x: X | null | undefined,
): X | number => x ?? NaN

export const unnan = <X>(x: X): X | undefined =>
  typeof x === 'number' ? (MathUtil.unnan(x) as X | undefined) : x

export const parseAndUnnan = (x: unknown): number | undefined => {
  const y = Number.parseFloat(x as string)
  return !Number.isNaN(y) ? y : undefined
}

export const orEmpty = StringUtil.orEmpty

export const unempty = <X>(x: X): X | undefined =>
  typeof x === 'string' ? (StringUtil.unempty(x) as X | undefined) : x

export const unemptied = (schema: ZodType) => z.preprocess(unempty, schema)

export const orNull = <X extends NonNullable<unknown>>(
  x: X | null | undefined,
): X | null => (x != null ? x : null)

export const mapDefined = <
  X extends NonNullable<unknown>,
  Y extends NonNullable<unknown>,
>(
  x: X | null | undefined,
  f: (x: X) => Y,
): Y | null | undefined => (x != null ? f(x) : x)

export const unNan = parseAndUnnan
