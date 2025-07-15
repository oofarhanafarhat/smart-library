import { db } from '@/lib/db/db'
import { students } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈 v15 signature
) {
  const { id } = await params                       // 👈 await zaroori hai

  await db.update(students).set({ isApproved: true }).where(eq(students.id, id))
  return NextResponse.json({ message: 'Student approved successfully' })
}
