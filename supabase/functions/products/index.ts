import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)

serve(async (req) => {
  const { pathname, searchParams } = new URL(req.url)

  // GET /products (list & search)
  if (req.method === 'GET' && pathname === '/products') {
    const search = searchParams.get('q')
    let query = supabase.from('products').select('*')
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    const { data, error } = await query
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  }

  // GET /products/:id (detail)
  const match = pathname.match(/^\/products\/(.+)$/)
  if (req.method === 'GET' && match) {
    const id = match[1]
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 404 })
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  }

  return new Response('Not found', { status: 404 })
}) 