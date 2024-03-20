import {useState} from 'react'

export const useLastPresent = present => {
  const [last, setLast] = useState(present)
  if (present.done() && present !== last) {
    setLast(present)
  }
  return present.done()
    ? present
    : last
}
