import { db } from '@/lib/db/db';
import { students } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Updated GET handler with correct signature
export async function GET(
  request: Request
) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ student: null }, { status: 400 });
  }

  const data = await db.select()
    .from(students)
    .where(eq(students.studentId, id));

  if (data.length === 0) {
    return NextResponse.json({ student: null }, { status: 404 });
  }

  return NextResponse.json({ student: data[0] });
}