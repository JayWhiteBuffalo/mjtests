'use client'
import {useEffect, useState} from 'react'
import assert from 'assert'
import ObjectUtil from '@util/ObjectUtil'
import ReObjectUtil from '@util/ReObjectUtil'

export class BaseFluxStore {
  constructor() {
    this.listenerId = 0
    this.listeners = {}
  }

  get() {}

  subscribe(listener) {
    const listenerId = this.listenerId += 1
    this.listeners[listenerId] = listener
    return () => delete this.listeners[listenerId]
  }

  notify(change) {
    for (const listenerId in this.listeners) {
      this.listeners[listenerId](change)
    }
  }
}

export class FluxStore extends BaseFluxStore {
  constructor() {
    super()
    this.value = {}
  }

  get() {
    return this.value
  }

  set(changes) {
    const newValue = ReObjectUtil.merge(this.value, changes)

    if (this.value !== newValue) {
      this.value = newValue
      this.notify()
      return true
    } else {
      return false
    }
  }
}

export class ComputedStore extends BaseFluxStore {
  constructor(fluxStores, f) {
    super()
    this.fluxStores = fluxStores
    this.f = f
    this._dirty = true

    for (const store of this.fluxStores) {
      store.subscribe(this._onStoreChange.bind(this))
    }
  }

  _onStoreChange() {
    if (!this._dirty) {
      this.notify()
      this._dirty = true
    }
  }

  get() {
    if (this._dirty) {
      this._dirty = false
      const states = this.fluxStores.map(store => store.get())
      this.value = this.f(...states)
    }
    return this.value
  }
}

export const FluxContainer = (fluxStores, C) => {
  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return C(...fluxStores.map(useFluxStore))
  }
}

export const useFluxStore = fluxStore => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [_, setDirty] = useState(0)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const increamentDirty = () => setDirty(dirty => dirty + 1)
    return fluxStore.subscribe(increamentDirty)
  }, [fluxStore])

  return fluxStore.get()
}

export class Dispatcher {
  constructor(actions) {
    this.actions = actions
  }

  dispatch(action) {
    const actionFn = ObjectUtil.getByPath(this.actions, action.type.split('.'))
    assert(actionFn, 'Invalid action.type %s', action.type)
    console.log(action)
    actionFn(action)
  }
}
