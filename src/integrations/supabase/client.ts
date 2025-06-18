
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kkxhaedaekxosbyzmjit.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreGhhZWRhZWt4b3NieXptaml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTY2MTEsImV4cCI6MjA2NTI5MjYxMX0.zwPlGGB-_lODoO_SbubdZezWFTrBGAcGi6BiFFydG28'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
