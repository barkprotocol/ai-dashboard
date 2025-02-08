import type React from "react"

interface EmailTemplateProps {
  title: string
  content: string
  ctaText?: string
  ctaUrl?: string
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ title, content, ctaText, ctaUrl }) => (
  <div style={container}>
    <div style={header}>
      <img src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`} alt="BARK AI" width={64} height={64} style={logo} />
    </div>
    <h1 style={heading}>{title}</h1>
    <p style={paragraph}>{content}</p>
    {ctaText && ctaUrl && (
      <a href={ctaUrl} style={button}>
        {ctaText}
      </a>
    )}
    <div style={footer}>
      <p style={footerText}>
        BARK AI - Your AI-powered DeFi assistant
        <br />© {new Date().getFullYear()} BARK Protocol. All rights reserved.
      </p>
    </div>
  </div>
)

// Styles
const container = {
  backgroundColor: "#f9fafb",
  padding: "40px 20px",
  fontFamily: "system-ui, -apple-system, sans-serif",
}

const header = {
  textAlign: "center" as const,
  marginBottom: "20px",
}

const logo = {
  margin: "0 auto",
}

const heading = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "30px 0 20px",
}

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "20px 0",
}

const footer = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "32px",
  paddingTop: "32px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
}

