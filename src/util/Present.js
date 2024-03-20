/*
An immutable, algebraic data type representing the status of some computation that may fail. 

It is either a pending status, an error, or a result:

{status: 'pending'}
{status: 'error', error: Error(message)}
{status: 'done', value: 'foo'}

Present behaves like a synchronous promise.
*/
export class Present {
  constructor(status, valueOrError) {
    this.status = status
    if (status === 'done') {
      this.value = valueOrError
    } else if (status === 'error') {
      this.error = valueOrError
    } else {
      this.status = 'pending'
    }
  }

  static resolve(x) { return new Present('done', x) }
  static reject(error) { return new Present('error', error) }
  static pend = new Present('pending')

  then(f, g) {
    if (this.status === 'done' && f) {
      try {
        const y = f(this.value)
        return y instanceof Present ? y : new Present('done', y)
      } catch (error) {
        return new Present('error', error)
      }
    } else if (this.status === 'error' && g) {
      try {
        const y = g(this.error)
        return y instanceof Present ? y : new Present('done', y)
      } catch (error) {
        return new Present('error', error)
      }
    } else {
      return this
    }
  }

  finally(f) {
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

  isSettled() { return this.status !== 'pending' }
  done() { return this.status === 'done'}
  resolved() { return this.status === 'done'}
  rejected() { return this.status === 'error'}
  pending() { return this.status === 'pending'}

  get() {
    if (this.status === 'done') {
      return this.value
    } else if (this.status === 'error') {
      throw this.error
    } else {
      return undefined
    }
  }

  getError() { return this.status === 'error' ? this.error : undefined }

  defined() {
    if (this.status === 'done') {
      return this.value
    } else if (this.status === 'error') {
      throw this.error
    } else {
      throw new Error('Unresolved present')
    }
  }

  orElse(y, z) {
    if (this.status === 'done') {
      return this.value
    } else if (this.status === 'error') {
      return typeof y === 'function' ? y(this.error) : y
    } else {
      return arguments.length === 2
        ? (typeof z === 'function' ? z() : z)
        : (typeof y === 'function' ? y() : y)
    }
  }

  orPending(z) {
    if (this.status === 'done') {
      return this.value
    } else if (this.status === 'error') {
      throw this.error
    } else {
      return typeof z === 'function' ? z() : z
    }
  }

  static all(presents) {
    const xs = []
    for (const present of presents) {
      if (present.done()) {
        xs.push(present.value)
      } else {
        return present
      }
    }
    return Present.resolve(xs)
  }

  static allSettled(presents) {
    const xs = []
    for (const present of presents) {
      if (present.done()) {
        xs.push({status: 'done', value: present.value})
      } else if (present.rejected()) {
        xs.push({status: 'error', reason: present.error})
      } else {
        return present
      }
    }
    return Present.resolve(xs)
  }

  static race(presents) {
    for (const present of presents) {
      if (present.done() || present.rejected()) {
        return present
      }
    }
    return Present.pend
  }

  static any(presents) {
    const errors = []
    for (const present of presents) {
      if (present.done()) {
        return present
      } else if (present.rejected()) {
        errors.push(present.error)
      } else {
        return present
      }
    }
    return Present.reject(AggregateError(errors))
  }

  toPromise() {
    return new Promise((resolve, reject) => {
      if (this.status === 'done') {
        resolve(this.value)
      } else if (this.status === 'error') {
        reject(this.error)
      }
    })
  }

  static xferFromPromise(promise, setter) {
    setter(Present.pend)
    return promise.then(
      value => setter(Present.resolve(value)),
      error => setter(Present.reject(error)),
    )
  }

  // Dirty workaround for bad interactions between React and then()
  reactWorkaround() {
    this.then = Present.prototype.then;
    return this
  }
}
