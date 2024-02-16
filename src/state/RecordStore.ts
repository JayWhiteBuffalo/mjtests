'use client'
import {FluxStore} from './Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'

export class RecordStore extends FluxStore {
  constructor(fieldName) {
    super()
    this.byId = {}
    this.fieldName = fieldName
  }

  get = id => {
    if (id == null) {
      return Present.pend
    }

    if (!this.byId[id]) {
      fetch(`/api/${this.fieldName}/${id}/`)
        .then(jsonOnOk)
        .then(record => {
          this.byId[id] = Present.resolve(record)
          this.notify()
        })
      this.byId[id] = Present.pend
    }
    return this.byId[id]
  }
}
