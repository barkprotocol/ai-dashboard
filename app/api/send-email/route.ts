import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sendEmail({ to, subject, html })

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error in send-email route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

