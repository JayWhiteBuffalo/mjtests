import {createBrowserClient} from '@supabase/ssr'
import {supabaseUrl} from './Env'

const supabase = createBrowserClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export default supabase
