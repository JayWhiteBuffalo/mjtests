// A promise that never resolves or rejects
export const bottomPromise: Promise<never> = new Promise(() => void 0)
export const voidPromise: Promise<undefined> = Promise.resolve(void 0)

export const clientOnlyComponent = () => {
  if (typeof window === 'undefined') {
    throw bottomPromise
  }
}

export const wait = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1e3))
