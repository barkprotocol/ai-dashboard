import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function updateSession(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req: request, res })
    await supabase.auth.getSession()
    return res
  } catch (e) {
    // If there's an error, return the original request without modifying
    return NextResponse.next()
  }
}

