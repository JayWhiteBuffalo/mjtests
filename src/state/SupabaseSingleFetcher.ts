import {SupabaseResponse, toRecords} from '../util/SupabaseUtil'
import type {PostgrestTransformBuilder} from '@supabase/postgrest-js'
import {bottomPromise} from '@/util/PromiseUtil'

export type MakeQuery<QueryParams, Row extends Record<string, unknown>> = (
  args: QueryParams,
) => PostgrestTransformBuilder<never, Row, Row[]>

export class SupabaseSingleFetcher<
  QueryParams,
  Row extends Record<string, unknown>,
> {
  aborter?: AbortController

  constructor(public makeQuery: MakeQuery<QueryParams, Row>) {}

  fetch(args: QueryParams): Promise<Row[]> {
    if (this.aborter) {
      this.aborter.abort()
    }
    this.aborter = new AbortController()
    return (
      this.makeQuery(args)
        .abortSignal(this.aborter.signal)
        .then<SupabaseResponse<Row[]>>(({data, error}) => {
          if (error?.code === '20') {
            // DOMException.ABORT_ERR
            return bottomPromise
          }
          return {data, error}
        })
        .then(toRecords) as Promise<Row[]>
    ).finally(() => delete this.aborter)
  }

  abort() {
    this.aborter!.abort()
  }
}
