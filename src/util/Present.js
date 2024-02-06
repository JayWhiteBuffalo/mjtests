import assert from 'assert'

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

  isSettled() { return this.status !== 'pending' }
  done() { return this.status === 'done'}
  resolved() { return this.status === 'done'}
  rejected() { return this.status === 'error'}
  pending() { return this.status === 'pending'}

  get() { return this.status === 'done' ? this.value : undefined }
  getError() { return this.status === 'error' ? this.error : undefined }
  defined() { assert(this.status === 'done'); return this.value }
  orElse(y, z) {
    if (this.status === 'done') {
      return this.value
    } else if (this.status === 'error') {
      return y()
    } else {
      return arguments.length === 2 ? z() : y()
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
    return Present.reject(errors)
  }
}
