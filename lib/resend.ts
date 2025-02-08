import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from = "BARK AI <notifications@bark.ai>",
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}

export async function sendVerificationEmail({
  email,
  token,
}: {
  email: string
  token: string
}) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`

  return sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Verify your email address</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this verification, you can safely ignore this email.</p>
    `,
  })
}

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string
  name: string
}) {
  return sendEmail({
    to: email,
    subject: "Welcome to BARK Protocol | AI!",
    html: `
      <h1>Welcome to BARK AI Dashboard, ${name}!</h1>
      <p>We're excited to have you on board. Here are some things you can do to get started:</p>
      <ul>
        <li>Set up your wallet</li>
        <li>Try out our AI chat</li>
        <li>Explore DeFi integrations</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `,
  })
}

export async function sendPasswordResetEmail({
  email,
  token,
}: {
  email: string
  token: string
}) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this password reset, you can safely ignore this email.</p>
    `,
  })
}

export async function sendNotificationEmail({
  email,
  subject,
  message,
}: {
  email: string
  subject: string
  message: string
}) {
  return sendEmail({
    to: email,
    subject,
    html: `
      <h1>${subject}</h1>
      <p>${message}</p>
    `,
  })
}

