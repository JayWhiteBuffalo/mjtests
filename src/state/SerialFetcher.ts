import {voidFn} from '@util/FnUtil'

export type MakeFetch = (args: any, signal: AbortSignal) => Promise<any>
export class SerialFetcher {
  aborter?: AbortController

  constructor(public makeFetch: MakeFetch) {
  }

  fetch(args) {
    if (this.aborter) {
      this.aborter.abort()
    }
    this.aborter = new AbortController()
    return this.makeFetch(args, this.aborter.signal)
      .catch(error => {
        if (error?.code === 20) {
          // DOMException.ABORT_ERR
          return new Promise(voidFn)
        } else {
          throw error
        }
      })
      .finally(() => delete this.aborter)
  }

  abort() {
    this.aborter?.abort()
  }
}
