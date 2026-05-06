import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si no hay vars (build time), creamos un cliente mock o lanzamos error controlado
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key missing. Client will be null.");
}

export const supabase = 
  (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : { from: () => ({ select: () => ({ data: null, error: new Error("Supabase not configured") }) }) } as any; 
// Hacemos un mock básico para que no rompa el tipado en dev, pero en build evita el crash del constructor.
