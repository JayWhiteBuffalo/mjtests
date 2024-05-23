export const isIterable = <X>(xs: unknown): xs is X[] =>
  typeof xs === 'object' && xs != null && Symbol.iterator in xs

const IteratorUtil = {
  isIterable,
}
export default IteratorUtil
