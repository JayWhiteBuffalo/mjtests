'use client'
import {FluxStore} from './Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'

export class RecordStore<
  Row,
  Id extends string | number = string,
> extends FluxStore<Record<Id, Promise<Row | undefined>>> {
  promisesById = {} as Record<Id, Promise<Row | undefined>>
  presentsById = {} as Record<Id, Present<Row | undefined>>

  constructor(public fieldName: string) {
    super()
  }

  get = () => this.promisesById

  fetch(id: Id): Promise<Row| undefined> {
    return fetch(`/api/${this.fieldName}/${id}/`)
      .then(jsonOnOk)
  }

  getById = (id: Id) => this.getPresentById(id).get()

  getPromiseById = (id: Id) => {
    if (!this.promisesById[id]) {
      this.promisesById[id] = this.fetch(id)
    }
    return this.promisesById[id]
  }

  getPresentById = (id: Id) => {
    if (!this.presentsById[id]) {
      Present.xferFromPromise(
        this.getPromiseById(id),
        present => this.presentsById[id] = present
      )
        .finally(() => this.notify())
    }
    return this.presentsById[id]
  }

  invalidate(id: Id) {
    delete this.presentsById[id]
    delete this.promisesById[id]
    this.notify()
  }
}
