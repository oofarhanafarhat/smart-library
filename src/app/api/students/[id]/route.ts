import { db } from '@/lib/db/db';
import { students } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params);

  const data = await db.select().from(students).where(eq(students.studentId, id));

  if (data.length === 0) {
    return NextResponse.json({ student: null }, { status: 404 });
  }

  return NextResponse.json({ student: data[0] });
}
