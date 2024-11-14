import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { projectId: number }

    return NextResponse.json({ projectId: decoded.projectId })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Reset link has expired' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Invalid reset link' },
      { status: 400 }
    )
  }
}