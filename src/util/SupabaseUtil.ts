import {type PostgrestError} from '@supabase/postgrest-js'
import type {RealtimePostgresChangesPayload} from '@supabase/supabase-js'

export type SupabaseResponse<
  Data,
  Error extends {message: string} = PostgrestError,
> = {
  data?: Data | null
  error: Error | null
}

export const throwOnError = <Data, Error extends {message: string}>({
  data,
  error,
}: SupabaseResponse<Data, Error>): Data => {
  if (error) {
    throw new Error(error.message)
  }
  return data!
}

export const toRecords = <Row>({
  data,
  error,
}: SupabaseResponse<Row[]>): Row[] => {
  if (error) {
    throw new Error(error.message)
  }
  if (!(data instanceof Array)) {
    throw new Error('Expected array of records from supabase query')
  }
  return data
}

export const uniqueRecord = <Row>({
  data,
  error,
}: SupabaseResponse<Row[]>): Row => {
  if (error) {
    throw new Error(error.message)
  }
  if (!(data instanceof Array)) {
    throw new Error('Expected array of records from supabase query')
  }
  if (data.length > 1) {
    throw new Error(
      'Multiple results from supabase query found, expected at most one',
    )
  }
  return data[0]
}

export const makeStorageUrl = (
  bucketName: string | undefined,
  path: string,
) => {
  if (bucketName) {
    return `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/${bucketName}/${path}`
  } else {
    return `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/${path}`
  }
}

export const extractStorageUrl = (
  url: string,
): {
  supabaseId?: string
  bucketName?: string
  path?: string
} => {
  const match = url.match(
    /^https?:\/\/(\w+).supabase.co\/storage\/v1\/object\/public\/(\w+)\/(.*)$/,
  )
  if (match) {
    const [_, supabaseId, bucketName, path] = match
    return {supabaseId, bucketName, path}
  } else {
    return {}
  }
}

// https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-LIKE
export const escapeLikePattern = (x: string) => x.replace(/([\\_%])/g, '\\$1')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnChange<Row extends {[key: string]: any}> = (
  payload: RealtimePostgresChangesPayload<Row>,
) => void
