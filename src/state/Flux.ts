'use client'
import {useEffect, useState} from 'react'
import ObjectUtil from '@util/ObjectUtil'
import ReObjectUtil from '@util/ReObjectUtil'

export class FluxStore {
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

export class ComputedStore extends FluxStore {
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

export class FluxFieldStore extends FluxStore {
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

export const FluxContainer = (fluxStores, C) => () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  C(...fluxStores.map(useFluxStore))

export const useFluxStore = fluxStore => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [_, forceUpdate] = useState({})

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    return fluxStore.subscribe(() => forceUpdate({}))
  }, [fluxStore])

  return fluxStore.get()
}

export class Dispatcher {
  constructor() {
    this.actions = {}
  }

  dispatch(action) {
    const actionFn = ObjectUtil.getByPath(this.actions, action.type.split('.'))
    if (typeof actionFn === 'function') {
      console.info(action)
      actionFn?.(action)
    } else {
      console.warn(`Invalid action with type=${action.type}`, action)
    }
  }

  registerActions(actions) {
    ObjectUtil.deepMergeInto(this.actions, ObjectUtil.deepClone(actions))
    return () => ObjectUtil.deepDeleteWith(this.actions, actions)
  }
}

export const dispatcher = new Dispatcher()
export const dispatch = dispatcher.dispatch.bind(dispatcher)
