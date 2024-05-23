import {callOptionalCallable, type OptionalCallable} from '@/util/FnUtil'
import {immerable} from 'immer'

export type PresentStatus = 'done' | 'error' | 'pending'

/*
An immutable, algebraic data type representing the status of some computation that may fail. 

It is either a pending status, an error, or a result:

{status: 'pending'}
{status: 'error', error: Error(message)}
{status: 'done', value: 'foo'}

Present behaves like a synchronous promise.
*/
export class Present<out Value> {
  status: PresentStatus
  value?: Value
  error?: Error;

  [immerable] = true

  constructor(status: PresentStatus, valueOrError?: Value | Error) {
    this.status = status
    if (status === 'done') {
      this.value = valueOrError as Value
    } else if (status === 'error') {
      this.error = valueOrError as Error
    } else {
      this.status = 'pending'
    }
  }

  static resolve<A>(x: A): Present<A> {
    return new Present('done', x)
  }
  static reject(error: Error): Present<never> {
    return new Present('error', error) as Present<never>
  }
  static pend: Present<never> = new Present('pending')

  then<B>(
    f: (a: Value) => B | Present<B>,
    g?: (error: Error) => B | Present<B>,
  ): Present<B> {
    if (this.status === 'done' && f) {
      try {
        const y = f(this.value!)
        return y instanceof Present ? y : new Present('done', y)
      } catch (error) {
        return new Present('error', error)
      }
    } else if (this.status === 'error' && g) {
      try {
        const y = g(this.error!)
        return y instanceof Present ? y : new Present('done', y)
      } catch (error) {
        return new Present('error', error)
      }
    } else {
      return this as unknown as Present<never>
    }
  }

  finally(f: () => void): Present<Value> {
    if (this.pending()) {
      return this
    }

    try {
      f()
      return this
    } catch (error) {
      return new Present('error', error)
    }
  }

  isSettled(): boolean {
    return this.status !== 'pending'
  }
  done(): boolean {
    return this.status === 'done'
  }
  resolved(): boolean {
    return this.status === 'done'
  }
  rejected(): boolean {
    return this.status === 'error'
  }
  pending(): boolean {
    return this.status === 'pending'
  }

  get(): Value | undefined {
    if (this.status === 'done') {
      return this.value
    } else {
      return undefined
    }
  }

  getError(): Error | undefined {
    return this.status === 'error' ? this.error : undefined
  }

  defined(): Value {
    if (this.status === 'done') {
      return this.value!
    } else if (this.status === 'error') {
      throw this.error
    } else {
      throw new Error('Unresolved present')
    }
  }

  orElse<Else>(b: Else | ((error?: Error) => Else)): Value | Else {
    if (this.status === 'done') {
      return this.value!
    } else if (this.status === 'error') {
      return typeof b === 'function'
        ? (b as (error: Error) => Else)(this.error!)
        : b
    } else {
      return callOptionalCallable(b)
    }
  }

  orElse3<B, C>(
    onError: B | ((error: Error) => B),
    onPending: OptionalCallable<C>,
  ): Value | B | C {
    if (this.status === 'done') {
      return this.value!
    } else if (this.status === 'error') {
      return typeof onError === 'function'
        ? (onError as (error: Error) => B)(this.error!)
        : onError
    } else {
      return callOptionalCallable(onPending)
    }
  }

  orPending<B>(b: OptionalCallable<B>): Value | B {
    if (this.status === 'done') {
      return this.value!
    } else if (this.status === 'error') {
      throw this.error
    } else {
      return callOptionalCallable(b)
    }
  }

  static all<A>(presents: Present<A>[]): Present<A[]> {
    const xs: A[] = []
    for (const present of presents) {
      if (present.done()) {
        xs.push(present.value!)
      } else {
        return present as Present<never>
      }
    }
    return Present.resolve(xs)
  }

  static allSettled<A>(presents: Present<A>[]): Present<Present<A>[]> {
    for (const present of presents) {
      if (!present.isSettled()) {
        return present as Present<never>
      }
    }
    return Present.resolve(presents)
  }

  static race<A>(presents: Present<A>[]): Present<A> {
    for (const present of presents) {
      if (present.done() || present.rejected()) {
        return present
      }
    }
    return Present.pend
  }

  static any<A>(presents: Present<A>[]): Present<A> {
    const errors: Error[] = []
    for (const present of presents) {
      if (present.done()) {
        return present
      } else if (present.rejected()) {
        errors.push(present.error!)
      } else {
        return present
      }
    }
    return Present.reject(AggregateError(errors))
  }

  toPromise(): Promise<Value> {
    return new Promise((resolve, reject) => {
      if (this.status === 'done') {
        resolve(this.value!)
      } else if (this.status === 'error') {
        reject(this.error)
      }
    })
  }

  static xferFromPromise<A>(
    promise: Promise<A>,
    setter: (present: Present<A>) => void,
  ): Promise<void> {
    setter(Present.pend)
    return promise.then(
      (value: A) => setter(Present.resolve(value)),
      (error: Error) => setter(Present.reject(error)),
    )
  }

  // Dirty workaround for bad interactions between React and then()
  reactWorkaround(): Present<Value> {
    this.then = Present.prototype.then
    return this
  }

  static fromObject<A>({status, value, error}: PresentObject<A>): Present<A> {
    return new Present(
      status,
      status === 'done' ? value : status === 'error' ? error : undefined,
    ) as Present<A>
  }

  toObject(): PresentObject<Value> {
    return {
      status: this.status,
      value: this.value,
      error: this.error,
    }
  }
}

export type PresentObject<out X> = {
  status: PresentStatus
  value?: X
  error?: unknown
}
