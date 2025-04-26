import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjbfluxiergktxmoxvax.supabase.co'; // <-- il tuo URL (già corretto)
const supabaseKey = 'process.env.NEXT_PUBLIC_SUPABASE_KEY'; // <-- poi vediamo come impostarlo
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
