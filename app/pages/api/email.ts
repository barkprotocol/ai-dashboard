import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

// Assume brevity is used within the existing code, but not declared.  We'll add a declaration here.
let brevity: string

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { email, name, message } = req.body

      // brevity is now declared and can be used here.  Example usage:
      brevity = "Short and sweet"

      const transporter = nodemailer.createTransport({
        service: "gmail", // Replace with your email service
        auth: {
          user: process.env.EMAIL_USER, // Replace with your email address
          pass: process.env.EMAIL_PASS, // Replace with your email password
        },
      })

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "recipient@example.com", // Replace with recipient email address
        subject: `Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      }

      const info = await transporter.sendMail(mailOptions)
      console.log("Message sent: %s", info.messageId)
      res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error sending email" })
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
}

export default handler

