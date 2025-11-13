import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.")
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export default supabase