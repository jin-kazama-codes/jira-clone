import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { parseCookies } from '@/utils/cookies'


const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {

    const { name, email } = await req.json()

    const projectId = parseCookies(req,"project").id

    
    const user = await prisma.defaultUser.create({
      data: {
        name,
        email,
      },
    })

    const member = await prisma.member.create({
        data: {
          id: user.id, 
          projectId: parseInt(projectId), 
        },
      })
  
      
      return NextResponse.json({ user, member }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 })
  }
}
