import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/server/db'

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }

    // Update user password
    await prisma.defaultUser.update({
      where: { email: decoded.email },
      data: { password: newPassword },
    })

    return NextResponse.json({ 
      message: 'Password reset successful' 
    })

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Reset link has expired' },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Error resetting password' },
      { status: 500 }
    )
  }
}