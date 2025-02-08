import { supabase } from "./supabase-client"

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"

export { supabase }