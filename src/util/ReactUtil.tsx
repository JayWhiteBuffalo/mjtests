export const setRef = (ref, elem) => {
  if (typeof ref === 'function') {
    ref(elem)
  } else if (typeof ref === 'object' && ref !== null) {
    ref.current = elem
  }
}
