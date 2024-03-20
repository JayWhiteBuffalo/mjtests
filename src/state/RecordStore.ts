'use client'
import {FluxStore} from './Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'

export class RecordStore extends FluxStore {
  constructor(fieldName) {
    super()
    this.promisesById = {}
    this.presentsById = {}
    this.fieldName = fieldName
  }

  get = () => this.promisesById

  fetch(id) {
    return fetch(`/api/${this.fieldName}/${id}/`)
      .then(jsonOnOk)
  }

  getById = id => this.getPresentById(id).get()

  getPromiseById = id => {
    if (!this.promisesById[id]) {
      this.promisesById[id] = this.fetch(id)
    }
    return this.promisesById[id]
  }

  getPresentById = id => {
    if (!this.presentsById[id]) {
      Present.xferFromPromise(
        this.getPromiseById(id),
        present => this.presentsById[id] = present
      )
        .finally(() => this.notify())
    }
    return this.presentsById[id]
  }

  invalidate(id) {
    delete this.presentsById[id]
    delete this.promisesById[id]
    this.notify()
  }
}
