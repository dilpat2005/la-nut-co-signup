import { createClient } from '@supabase/supabase-js'

// Simple URL encoding function
const encodeURL = (url) => encodeURIComponent(url).replace(/%2E/g, '.');

const supabaseUrl = encodeURL(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
