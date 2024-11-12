// app/api/forgot-password/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getBaseUrl } from '@/utils/helpers'
import { prisma } from '@/server/db'
const jwt = require('jsonwebtoken')
const baseURL = getBaseUrl()

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "atechno27@gmail.com",
      pass: "xplt mjdc hkpf xpkm",
    },
  });

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Check if user exists
    const user = await prisma.defaultUser.findFirst({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 } // Return 200 even if user not found for security
      )
    }

    // Generate JWT token with user email and expiry
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    // Create reset URL with JWT token
    const resetUrl = `${baseURL}/reset-password?token=${resetToken}`

    // Email template
    const mailOptions = {
      from: "atechno27@gmail.com",
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Passwosrd Reset Request</h2>
          <p>You requested to reset your password. Click the link below to set a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      message: 'If an account exists with this email, you will receive a password reset link.' 
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}