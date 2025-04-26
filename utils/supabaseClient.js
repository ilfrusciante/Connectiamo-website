import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjbffluxierkgtxmoxvax.supabase.co'; // la tua URL di Supabase
const supabaseKey = 'process.env.NEXT_PUBLIC_SUPABASE_KEY'; // la tua key che metteremo in .env.local

export const supabase = createClient(supabaseUrl, supabaseKey);
