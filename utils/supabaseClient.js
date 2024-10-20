import { createClient } from '@supabase/supabase-js'

// Simple URL encoding function
const encodeURL = (url) => encodeURIComponent(url).replace(/%.../g, (match) => {
  switch (match) {
    case '%2E': return '.';
    case '%2D': return '-';
    case '%5F': return '_';
    case '%7E': return '~';
    default: return match;
  }
});

const supabaseUrl = encodeURL(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
