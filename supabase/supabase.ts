import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    "Missing Supabase URL. Ensure 'EXPO_PUBLIC_SUPABASE_URL' is set in your .env and restart with 'expo start -c'."
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing Supabase anon key. Ensure 'EXPO_PUBLIC_SUPABASE_ANON_KEY' is set in your .env and restart with 'expo start -c'."
  )
}

// Only use AsyncStorage on native; avoid using it on web/Node (no window)
let storage: any | undefined
if (Platform.OS !== 'web') {
  // require lazily so the module isn't evaluated in Node/web
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  storage = require('@react-native-async-storage/async-storage').default
}

const authOptions: any = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
  ...(storage ? { storage } : {}),
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authOptions,
})
