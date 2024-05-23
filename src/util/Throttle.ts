import {wait} from '@/util/PromiseUtil'

export type ThrottleOptions = {
  minSpacing: number
  minWait: number
}

const defaultOptions: ThrottleOptions = {
  minSpacing: 0.05,
  minWait: 0.001,
}

/*
- Calls are spaced 50ms between each other.
- Calls have a minimum wait of 1ms before starting.
- If multiple calls are waiting, then all calls return with the output of the last call.
*/
export class ThrottleTakeLast<out Output> {
  waitingPromise?: Promise<Output>
  startTime: number = -Infinity
  options: ThrottleOptions
  lastFn?: () => Promise<Output>

  constructor(options: Partial<ThrottleOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  call(fn: () => Promise<Output>): Promise<Output> {
    this.lastFn = fn
    return (this.waitingPromise ??= this.#newCall())
  }

  async #newCall() {
    const sinceLast = (Date.now() - this.startTime) / 1e3
    await wait(
      Math.max(this.options.minWait, this.options.minSpacing - sinceLast),
    )

    delete this.waitingPromise
    this.startTime = Date.now()

    return await this.lastFn!()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttleTakeLast = <Return, Params extends any[]>(
  fn: (...args: Params) => Promise<Return>,
  options?: ThrottleOptions,
): ((...args: Params) => Promise<Return>) => {
  const throttle = new ThrottleTakeLast<Return>(options)
  return (...args) => throttle.call(() => fn(...args))
}

/*
- Calls are spaced 50ms between each other.
- Calls have a minimum wait of 1ms before starting.
- If multiple calls are waiting, only the last one is executed. The rest are dropped.
*/
export class ThrottleDrop<out Output> {
  waitingPromise?: Promise<void>
  startTime: number = -Infinity
  options: ThrottleOptions
  lastResolve?: () => void

  constructor(options: Partial<ThrottleOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  async call(fn: () => Promise<Output>): Promise<Output> {
    this.waitingPromise ??= this.#wait()

    // TODO check memory leaks
    await new Promise<void>(resolve => (this.lastResolve = resolve))

    return await fn()
  }

  async #wait() {
    const sinceLast = (Date.now() - this.startTime) / 1e3
    await wait(
      Math.max(this.options.minWait, this.options.minSpacing - sinceLast),
    )

    this.lastResolve!()
    delete this.lastResolve
    delete this.waitingPromise
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttleDrop = <Return, Params extends any[]>(
  fn: (...args: Params) => Promise<Return>,
  options?: ThrottleOptions,
): ((...args: Params) => Promise<Return>) => {
  const throttle = new ThrottleDrop<Return>(options)
  return (...args) => throttle.call(() => fn(...args))
}
