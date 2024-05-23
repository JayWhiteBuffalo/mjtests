'use client'
import {useEffect, useState} from 'react'
import ObjectUtil from '@util/ObjectUtil'
import ReObjectUtil from '@util/ReObjectUtil'

export type Listener<Change = never> = (change?: Change) => void

export class FluxStore<Value = undefined, Change = never> {
  listenerId: number
  listeners: Record<number, Listener<Change>>

  constructor() {
    this.listenerId = 0
    this.listeners = {}
  }

  get(): Value {
    return undefined as Value
  }

  subscribe(listener: Listener<Change>): () => void {
    const listenerId = (this.listenerId += 1)
    this.listeners[listenerId] = listener
    return () => delete this.listeners[listenerId]
  }

  notify(change?: Change) {
    for (const listenerId in this.listeners) {
      this.listeners[listenerId](change)
    }
  }
}

export class ComputedStore<A> extends FluxStore<A> {
  fluxStores: FluxStore<unknown>[]
  f: (...args: unknown[]) => A
  _dirty: boolean
  value?: A

  constructor(fluxStores: FluxStore<unknown>[], f: (...args: unknown[]) => A) {
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

  get(): A {
    if (this._dirty) {
      this._dirty = false
      const states = this.fluxStores.map(store => store.get())
      this.value = this.f(...states)
    }
    return this.value as A
  }
}

export class FluxFieldStore<
  Value extends Record<string, unknown>,
> extends FluxStore<Value> {
  constructor(public value: Value) {
    super()
    this.value = {}
  }

  get(): Value {
    return this.value
  }

  set(changes: Partial<Value>) {
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

export const useFluxStore: <Value>(
  fluxStore: FluxStore<Value>,
) => Value = fluxStore => {
  const [_, forceUpdate] = useState({})
  useEffect(() => fluxStore.subscribe(() => forceUpdate({})), [fluxStore])

  return fluxStore.get()
}

export type FluxAction = Record<string, unknown> & {type: string}
export type FluxActionFn = (action: FluxAction) => void
type FluxActionFns = Record<string, FluxActionFn | unknown>

export class Dispatcher {
  actions: FluxActionFns

  constructor() {
    this.actions = {}
  }

  dispatch(action: FluxAction) {
    const actionFn = ObjectUtil.getByPath(this.actions, action.type.split('.'))
    if (typeof actionFn === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).logFluxAction !== false) {
        console.info(action)
      }
      actionFn(action)
    } else {
      console.warn(`Invalid action with type=${action.type}`, action)
    }
  }

  registerActions(actions: FluxActionFns): () => void {
    ObjectUtil.deepMergeInto(this.actions, ObjectUtil.deepClone(actions))
    return () => void ObjectUtil.deepDeleteWith(this.actions, actions)
  }
}

export const dispatcher = new Dispatcher()
export const dispatch: (action: FluxAction) => void =
  dispatcher.dispatch.bind(dispatcher)
