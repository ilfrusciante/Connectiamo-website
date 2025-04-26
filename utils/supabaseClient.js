import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjbffluxierkgtxmoxvax.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYmZsdXhpZXJrZ3R4bW94dmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNjk0NzUsImV4cCI6MjAyOTY0NTQ3NX0.1eHZ06I29YDJ6HhsAVc4Gh_4RrUwJ0B2xapni23iibM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
