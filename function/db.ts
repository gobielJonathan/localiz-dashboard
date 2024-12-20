import { createClient } from '@supabase/supabase-js'
import { Database } from '@/model/database.types'

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // Ensures sessions are persisted
        autoRefreshToken: true, // Automatically refresh tokens
        
    }
})