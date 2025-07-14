 import { db } from '@/lib/db/db';
import { students } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(context: { params: { id: string } }) {
  const { id } = await Promise.resolve(context.params);

  try {
    await db.update(students).set({ isApproved: true }).where(eq(students.id, id));
    return NextResponse.json({ message: " Student approved successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}

